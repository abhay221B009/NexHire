require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

const fs = require("fs");
const path = require("path");

const { app } = require("../../src/app");

const User = require("../../src/models/User");
const CandidateProfile = require("../../src/models/CandidateProfile");


// ------------------------------------------------------------
// TEST DATA
// ------------------------------------------------------------

const candidateA = {
  name: "Resume Candidate A",
  email: "resume-a@nexhire.local",
  password: "TestPassword123!",
  role: "candidate",
};

const candidateB = {
  name: "Resume Candidate B",
  email: "resume-b@nexhire.local",
  password: "TestPassword123!",
  role: "candidate",
};


// ------------------------------------------------------------
// TEST FILES
// ------------------------------------------------------------

const testDirectory = path.join(
  process.cwd(),
  "tests",
  "fixtures"
);

const validPdfPath = path.join(
  testDirectory,
  "resume.pdf"
);


// ------------------------------------------------------------
// CREATE A MINIMAL VALID PDF
// ------------------------------------------------------------

const createTestPdf = () => {

  if (!fs.existsSync(testDirectory)) {

    fs.mkdirSync(testDirectory, {
      recursive: true,
    });

  }


  const pdfContent =
`%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [] /Count 0 >>
endobj
trailer
<< /Root 1 0 R >>
%%EOF
`;


  fs.writeFileSync(
    validPdfPath,
    pdfContent
  );
};


// ------------------------------------------------------------
// HELPER
// ------------------------------------------------------------

const createCandidateProfile = async (user) => {

  return CandidateProfile.create({
    userId: user._id,
    phone: "9876543210",
    location: "Noida",
    bio: "Test candidate",
    skills: ["JavaScript", "React"],
    experience: 0,
    education: "B.Tech",
  });
};


// ------------------------------------------------------------
// TEST SUITE
// ------------------------------------------------------------

describe(
  "Resume upload and download",
  () => {

    let candidateAUser;
    let candidateBUser;

    let candidateACookie;
    let candidateBCookie;


    // --------------------------------------------------------
    // CONNECT DATABASE
    // --------------------------------------------------------

    beforeAll(async () => {

      await mongoose.connect(
        process.env.MONGODB_URI
      );


      await User.init();

      await CandidateProfile.init();


      createTestPdf();


      // Clean previous test users.

      await User.deleteMany({
        email: {
          $in: [
            candidateA.email,
            candidateB.email,
          ],
        },
      });

    });


    // --------------------------------------------------------
    // CREATE TEST CANDIDATES
    // --------------------------------------------------------

    beforeAll(async () => {

      let response;


      // Candidate A

      response = await request(app)
        .post("/api/auth/signup")
        .send(candidateA);


      if (
        response.status !== 201 &&
        response.status !== 409
      ) {

        throw new Error(
          `Candidate A signup failed: ${response.status}`
        );

      }


      candidateAUser =
        await User.findOne({
          email: candidateA.email,
        });


      // Candidate B

      response = await request(app)
        .post("/api/auth/signup")
        .send(candidateB);


      if (
        response.status !== 201 &&
        response.status !== 409
      ) {

        throw new Error(
          `Candidate B signup failed: ${response.status}`
        );

      }


      candidateBUser =
        await User.findOne({
          email: candidateB.email,
        });


      // Create profiles.

      await CandidateProfile.deleteMany({
        userId: {
          $in: [
            candidateAUser._id,
            candidateBUser._id,
          ],
        },
      });


      await createCandidateProfile(
        candidateAUser
      );


      await createCandidateProfile(
        candidateBUser
      );


      // Login Candidate A.

      response = await request(app)
        .post("/api/auth/login")
        .send({
          email: candidateA.email,
          password: candidateA.password,
        });


      if (response.status !== 200) {

        throw new Error(
          `Candidate A login failed: ${response.status}`
        );

      }


      candidateACookie =
        response.headers["set-cookie"];


      // Login Candidate B.

      response = await request(app)
        .post("/api/auth/login")
        .send({
          email: candidateB.email,
          password: candidateB.password,
        });


      if (response.status !== 200) {

        throw new Error(
          `Candidate B login failed: ${response.status}`
        );

      }


      candidateBCookie =
        response.headers["set-cookie"];

    });


    // --------------------------------------------------------
    // CLEANUP
    // --------------------------------------------------------

    afterAll(async () => {

      if (
        mongoose.connection.readyState === 1
      ) {

        await CandidateProfile.deleteMany({
          userId: {
            $in: [
              candidateAUser?._id,
              candidateBUser?._id,
            ],
          },
        });


        await User.deleteMany({
          email: {
            $in: [
              candidateA.email,
              candidateB.email,
            ],
          },
        });


        await mongoose.connection.close();

      }


      if (fs.existsSync(validPdfPath)) {

        fs.unlinkSync(validPdfPath);

      }

    });


    // --------------------------------------------------------
    // VALID PDF UPLOAD
    // --------------------------------------------------------

    test(
      "should allow a candidate to upload a valid PDF resume",
      async () => {

        const response =
          await request(app)
            .post("/api/profile/resume")
            .set(
              "Cookie",
              candidateACookie
            )
            .attach(
              "resume",
              validPdfPath
            );


        expect(response.status).toBe(200);

        expect(response.body.success)
          .toBe(true);

        expect(response.body.resume)
          .toBeDefined();


        expect(
          response.body.resume.originalName
        ).toBe("resume.pdf");


        expect(
          response.body.resume.mimeType
        ).toBe("application/pdf");


        const profile =
          await CandidateProfile.findOne({
            userId: candidateAUser._id,
          });


        expect(profile.resume)
          .toBeDefined();


        expect(
          profile.resume.originalName
        ).toBe("resume.pdf");


        expect(
          profile.resume.storedName
        ).toBeDefined();


        expect(
          profile.resume.path
        ).toBeDefined();


        expect(
          fs.existsSync(
            profile.resume.path
          )
        ).toBe(true);

      }
    );


    // --------------------------------------------------------
    // REPLACE RESUME
    // --------------------------------------------------------

    test(
      "should replace an existing resume",
      async () => {

        const profileBefore =
          await CandidateProfile.findOne({
            userId: candidateAUser._id,
          });


        const oldPath =
          profileBefore.resume.path;


        const response =
          await request(app)
            .post("/api/profile/resume")
            .set(
              "Cookie",
              candidateACookie
            )
            .attach(
              "resume",
              validPdfPath,
              "updated-resume.pdf"
            );


        expect(response.status)
          .toBe(200);


        const profileAfter =
          await CandidateProfile.findOne({
            userId: candidateAUser._id,
          });


        expect(
          profileAfter.resume.originalName
        ).toBe("updated-resume.pdf");


        expect(
          profileAfter.resume.path
        ).not.toBe(oldPath);


        expect(
          fs.existsSync(oldPath)
        ).toBe(false);


        expect(
          fs.existsSync(
            profileAfter.resume.path
          )
        ).toBe(true);

      }
    );


    // --------------------------------------------------------
    // DOWNLOAD OWN RESUME
    // --------------------------------------------------------

    test(
      "should allow a candidate to download their own resume",
      async () => {

        const response =
          await request(app)
            .get("/api/profile/resume")
            .set(
              "Cookie",
              candidateACookie
            );


        expect(response.status)
          .toBe(200);


        expect(
          response.headers["content-type"]
        ).toMatch(/application\/pdf/);


        expect(
          response.body
        ).toBeDefined();

      }
    );


    // --------------------------------------------------------
    // BLOCK UNAUTHENTICATED DOWNLOAD
    // --------------------------------------------------------

    test(
      "should reject unauthenticated resume download",
      async () => {

        const response =
          await request(app)
            .get("/api/profile/resume");


        expect(response.status)
          .toBe(401);


        expect(response.body.success)
          .toBe(false);

      }
    );


    // --------------------------------------------------------
    // BLOCK UNAUTHENTICATED UPLOAD
    // --------------------------------------------------------

    test(
      "should reject unauthenticated resume upload",
      async () => {

        const response =
          await request(app)
            .post("/api/profile/resume")
            .attach(
              "resume",
              validPdfPath
            );


        expect(response.status)
          .toBe(401);


        expect(response.body.success)
          .toBe(false);

      }
    );


    // --------------------------------------------------------
    // CANDIDATE B ONLY GETS THEIR OWN PROFILE
    // --------------------------------------------------------

    test(
      "should keep resume access scoped to the authenticated candidate",
      async () => {

        const candidateBProfile =
          await CandidateProfile.findOne({
            userId: candidateBUser._id,
          });


        expect(
          candidateBProfile.resume
        ).toBeUndefined();


        const response =
          await request(app)
            .get("/api/profile/resume")
            .set(
              "Cookie",
              candidateBCookie
            );


        expect(response.status)
          .toBe(404);

      }
    );


    // --------------------------------------------------------
    // INVALID FILE CONTENT
    // --------------------------------------------------------

    test(
      "should reject a fake PDF based on file content",
      async () => {

        const fakePdfPath =
          path.join(
            testDirectory,
            "fake.pdf"
          );


        fs.writeFileSync(
          fakePdfPath,
          "This is not a real PDF file"
        );


        const response =
          await request(app)
            .post("/api/profile/resume")
            .set(
              "Cookie",
              candidateACookie
            )
            .attach(
              "resume",
              fakePdfPath
            );


        expect(response.status)
          .toBe(400);


        expect(response.body.success)
          .toBe(false);


        fs.unlinkSync(fakePdfPath);

      }
    );


    // --------------------------------------------------------
    // UNSUPPORTED FILE TYPE
    // --------------------------------------------------------

    test(
      "should reject unsupported file types",
      async () => {

        const txtPath =
          path.join(
            testDirectory,
            "resume.txt"
          );


        fs.writeFileSync(
          txtPath,
          "This is a text file"
        );


        const response =
          await request(app)
            .post("/api/profile/resume")
            .set(
              "Cookie",
              candidateACookie
            )
            .attach(
              "resume",
              txtPath
            );


        expect(response.status)
          .toBe(400);


        expect(response.body.success)
          .toBe(false);


        fs.unlinkSync(txtPath);

      }
    );

  }
);