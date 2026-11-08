# HanapHire

A recruitment website connecting employers with job seekers.

HanapHire is a fictional business developed as an academic case study. The project demonstrates recruitment workflows through responsive pages, interactive forms, dashboards, and browser-based data storage.

## About the Project

The website provides separate interfaces for employers and job seekers. Employers can explore candidate profiles, prepare job posts, review applicants, and manage company information. Job seekers can review recommended opportunities, save jobs, record applications, and follow conversations with employers.

The project applies HTML, CSS, and JavaScript concepts covered in class, including tables, forms, ES6 syntax, events, window objects, DOM manipulation, and client-side validation.

## Features

### Public Pages

- Homepage with featured job seekers and employers
- Candidate directory with search, filters, and sorting
- Candidate profiles with a print option
- Job-posting form with a review step
- About, How It Works, and Contact pages
- Account-type selection and separate registration forms
- Login and password-reset interfaces

### Employer Interface

- Recruitment dashboard
- Job editing and publication-status controls
- Applicant shortlisting and hiring-status updates
- Company-profile editing
- Messaging interface

### Job Seeker Interface

- Dashboard with recommended opportunities
- Saved-job management
- Application confirmation and history
- Application search and status filtering
- Messaging interface

### Interactive Functions

- Password visibility controls
- Password-confirmation checks
- Inline form-validation messages
- Search and filtering
- Styled confirmation and success dialogs
- Message character counters
- Browser storage for selected records

## Technologies Used

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure, forms, and tables |
| CSS3 | Styling and responsive layouts |
| JavaScript | Interactions, validation, and dynamic content |
| localStorage | Retaining selected records in the browser |

No backend server or database is required to run the current prototype.

## Project Structure

```text
.
├── index.html
├── about.html
├── contact.html
├── howItWorks.html
├── login.html
├── forgotPassword.html
├── register.html
├── registerJobSeeker.html
├── registerEmployer.html
├── findJobs.html
├── candidateProfile.html
├── postJob.html
├── employerDashboard.html
├── manageApplicants.html
├── manageJobs.html
├── companyProfile.html
├── jobSeekerDashboard.html
├── savedJobs.html
├── myApplications.html
├── messages.html
├── css/
│   ├── style.css
│   └── pages/
├── js/
└── asset/
    └── images/
```

## Getting Started

1. Download the repository or clone it using its GitHub repository URL.
2. Open the project folder in Visual Studio Code.
3. Run `index.html` using a local development server, such as Live Server.
4. Explore the public pages and dashboard interfaces.

Use the same browser and local server address when testing features that share browser storage.

## Dashboard Access

Open the Login page and use either access button:

- **Employer Dashboard**
- **Job Seeker Dashboard**

These buttons provide direct access for presentation and testing. They do not perform secure authentication.

## Suggested Testing

1. Register as either account type and check the validation messages.
2. Search and filter candidates.
3. Complete a job-posting form and review the entered details.
4. Edit a job or change a draft posting to Active.
5. Shortlist an applicant and confirm a hiring-status change.
6. Save an opportunity from the job seeker dashboard.
7. Record an application and open My Applications.
8. Open Messages, select a conversation, and send a reply.
9. Refresh the page to check records retained in browser storage.

## Current Limitations

- HanapHire is a fictional business, and the website uses illustrative records.
- Registration does not create actual user accounts.
- Login access is not protected by authentication.
- Contact and password-reset confirmations do not send email.
- Messaging works within the browser and does not deliver messages to separate users or devices.
- Browser-stored records are specific to the browser and website address. Clearing site data removes them.
- Some edits affect only the current page and reset after refreshing.
- Not all modules share a common data source.
- The job seeker **Find Jobs** link currently opens the candidate directory in `findJobs.html`. Recommended and saved-job cards provide the current job-discovery experience.
- The prototype has not undergone production-level security, performance, or comprehensive accessibility testing.

Use sample information when testing the website rather than real passwords or sensitive personal data.

## Possible Improvements

- Secure registration and authentication
- Backend services and centralized database storage
- A dedicated job-listings directory
- Integration between job posts, applications, and dashboard summaries
- Actual email delivery and account recovery
- Messaging between authenticated users
- Improved accessibility and automated testing

## Academic Purpose

This project was developed as a case study project for **IT-WS02 — Web Systems and Technologies 2**. It demonstrates the planning, design, and development of an interactive recruitment website using HTML, CSS, and JavaScript.

The project applies course concepts including tables, forms, ES6 syntax, events, window objects, DOM manipulation, and client-side form validation. It is intended for educational presentation and evaluation and does not operate as an actual recruitment service.
