// Skills Section Logo's
import htmlLogo from './assets/tech_logo/html.png';
import cssLogo from './assets/tech_logo/css.png';
import javascriptLogo from './assets/tech_logo/javascript.png';
import reactjsLogo from './assets/tech_logo/reactjs.png';
import reduxLogo from './assets/tech_logo/redux.png';
import tailwindcssLogo from './assets/tech_logo/tailwindcss.png';
import materialuiLogo from './assets/tech_logo/materialui.png';
import bootstrapLogo from './assets/tech_logo/bootstrap.png';
import nodejsLogo from './assets/tech_logo/nodejs.png';
import expressjsLogo from './assets/tech_logo/express.png';
import mysqlLogo from './assets/tech_logo/mysql.png';
import mongodbLogo from './assets/tech_logo/mongodb.png';
import firebaseLogo from './assets/tech_logo/firebase.png';
import javaLogo from './assets/tech_logo/java.png';
import typescriptLogo from './assets/tech_logo/typescript.png';
import gitLogo from './assets/tech_logo/git.png';
import githubLogo from './assets/tech_logo/github.png';
import vscodeLogo from './assets/tech_logo/vscode.png';
import postmanLogo from './assets/tech_logo/postman.png';
import mcLogo from './assets/tech_logo/mc.png';
import figmaLogo from './assets/tech_logo/figma.png';
import netlifyLogo from './assets/tech_logo/netlify.png';
import vercelLogo from './assets/tech_logo/vercel.png';
import postgreLogo from './assets/tech_logo/postgre.png';

// Education Section Logo's
import bsaLogo from './assets/education_logo/rgpv_logo.png';

// Project Section Logo's
import kanbanLogo from './assets/work_logo/kanbanLogo.png';
import bgRemoverLogo from './assets/work_logo/bgRemoverLogo.png';
import forkifyLogo from './assets/work_logo/forkifyLogo.png';
import aiSummaryLogo from './assets/work_logo/aiSummaryLogo.png';
import hotstarCloneLogo from './assets/work_logo/hotstarCloneLogo.png';

export const SkillsInfo = [
  {
    title: 'Frontend',
    skills: [
      { name: 'HTML', logo: htmlLogo },
      { name: 'CSS', logo: cssLogo },
      { name: 'JavaScript', logo: javascriptLogo },
      { name: 'React JS', logo: reactjsLogo },
      { name: 'Redux', logo: reduxLogo },
      { name: 'Tailwind CSS', logo: tailwindcssLogo },
      { name: 'Material UI', logo: materialuiLogo },
      { name: 'Bootstrap', logo: bootstrapLogo },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node JS', logo: nodejsLogo },
      { name: 'Express JS', logo: expressjsLogo },
      { name: 'MySQL', logo: mysqlLogo },
      { name: 'MongoDB', logo: mongodbLogo },
      { name: 'Firebase', logo: firebaseLogo },
      { name: 'PostgreSQL', logo: postgreLogo },
    ],
  },
  {
    title: 'Languages',
    skills: [
      { name: 'Java', logo: javaLogo },
      { name: 'JavaScript', logo: javascriptLogo },
      { name: 'TypeScript', logo: typescriptLogo },
    ],
  },
  {
    title: 'Tools',
    skills: [
      { name: 'Git', logo: gitLogo },
      { name: 'GitHub', logo: githubLogo },
      { name: 'VS Code', logo: vscodeLogo },
      { name: 'Postman', logo: postmanLogo },
      { name: 'Compass', logo: mcLogo },
      { name: 'Vercel', logo: vercelLogo },
      { name: 'Netlify', logo: netlifyLogo },
      { name: 'Figma', logo: figmaLogo },
    ],
  },
];
  
  export const education = [
    {
      id: 0,
      img: bsaLogo,
      University: "RGPV Bhopal",
      Duration: "2019 - Aug 2023",
      grade: "7.86 CGPA",
      desc: "I completed my Bachelor's degree in Computer Science (BTech) from RGPV University. Throughout my studies, I was immersed in a variety of subjects that deepened my understanding of computing and technology. From exploring Data Structures and Algorithms to diving into Web Development and Database Management Systems, I gained practical insights into the world of software development.",
      degree: "Bachelor of Technology - BTech (Computer Science)",
    }
  ];
  
  export const projects = [
  {
    id: 0,
    title: "Kanban Board",
    description:
      "A responsive Kanban board built with React and TypeScript featuring smooth drag-and-drop functionality using @hello-pangea/dnd, light/dark theme toggle, and persistent state using Context API, useReducer, and localStorage.",
    image: kanbanLogo,
    tags: ["React", "TypeScript", "CSS Modules", "Context API", "DND", "LocalStorage"],
    github: "https://github.com/sanketmalvi/kanban-board",
    webapp: "https://kanban-board-eight-tan.vercel.app/", 
  },
  {
    id: 1,
    title: "AI Background Remover",
    description:
      "A full-stack AI-powered background remover app using MERN stack, with Stripe integration for payments, Clerk for authentication, and Cloudinary for secure image storage and delivery.",
    image: bgRemoverLogo,
    tags: ["React", "Node.js", "Express", "MongoDB", "Cloudinary", "Stripe", "Clerk"],
    github: "https://github.com/sanketmalvi",
    webapp: "https://ai-bg-removal-sd.vercel.app/",
  },
  {
    id: 2,
    title: "Forkify – Recipe App",
    description:
      "A modern recipe web app built using JavaScript and MVC architecture. Features include API integration, dynamic rendering, bookmarking, pagination, and robust error handling for enhanced user experience.",
    image: forkifyLogo,
    tags: ["JavaScript", "MVC", "API", "Parcel"],
    github: "https://github.com/sanketmalvi/Forkify",
    webapp: "https://forkify-recipe-app.netlify.app/", 
  },
  {
    id: 3,
    title: "Student Management System (PostgreSQL)",
    description:
      "A backend REST API project for managing student records with pagination, role-based access, stored procedures, and multi-environment deployment setup.",
    image: aiSummaryLogo,
    tags: ["Node.js", "Express", "PostgreSQL", "REST API"],
    github: "https://github.com/yourusername/student-management-system",
    webapp: "", 
  },
  {
    id: 4,
    title: "AI Summary Generator",
    description:
      "A web application built with React, Tailwind CSS, Redux, and OpenAI API that generates summaries of websites by extracting content from their URLs. Showcases the capabilities of generative AI.",
    image: aiSummaryLogo,
    tags: ["React", "Tailwind CSS", "Redux", "OpenAI API"],
    github: "https://github.com/sanketmalvi/AI-Based-Summary-Generator",
    webapp: "https://ai-based-summary-generator.vercel.app/", 
  },
  {
    id: 5,
    title: "Hotstar Clone",
    description:
      "A visually engaging Hotstar clone mimicking the UI and basic functionality of the popular streaming platform using React and responsive design principles.",
    image: hotstarCloneLogo,
    tags: ["React", "HTML", "CSS", "JavaScript"],
    github: "https://github.com/sanketmalvi/HotstarClone",
    webapp: "https://hotstar-clone-hazel.vercel.app/",
  },
];
