export const DATA = {
  me: "Edward Nguyen",
  bio: "I am an undergraduate at [brown] studying Mathematics and Computer Science. My research interests are in systems, particularly networking, programming languages, and verification. Through research and teaching, I aim to promote curiosity in learning and spread joy by cultivating collaborative communities. My recent projects have been in collaboration with [akshay_n] and [christina_s].\n \n Outside of academics, I enjoy food, rock climbing, board games, video games, and playing trumpet for any ensemble I have time for.",
  email: {
    address: "edward_nguyen",
    domain: "brown.edu",
  },
  links: {
    psf: {
      name: "Problem-Solving Fellows",
      url: "https://sheridan.brown.edu/programs/institutes/problem-solving-course-design-institute/problem-solving-fellows",
    },
    alex_k: {
      name: "Alex Khosrowshahi",
      url: "https://spoonmilk.xyz/",
    },
    akshay_n: {
      name: "Akshay Narayan",
      url: "https://akshayn.xyz",
    },
    franco_s: {
      name: "Franco Solleza",
      url: "https://www.francosolleza.com/",
    },
    christina_s: {
      name: "Christina Smith",
      url: "https://sheridan.brown.edu/people/christina-smith-phd",
    },
    brown: {
      name: "Brown University",
      url: "https://brown.edu",
    },
  },
  projects: [
    {
      title: "Trafik",
      description:
        "I am working with [alex_k], [franco_s], and [akshay_n] to develop a DSL and compiler to implement congestion control algorithms in eBPF. Our primary contribution is verifier safety: we compile everything that we can into eBPF, but functions that we determine are <em>not</em> verifier-safe compile to run in userspace.",
      links: [],
    },
    {
      title: "S/NC",
      description:
        "I lead a research team of eight [psf] to investigate student, faculty, and advisor perspectives on the S/NC (pass/fail) system at Brown University through interviews and surveys. Our goal is to better understand how these perspectives affect students' decision making, advisor advice, and faculty course design practices. With this knowledge, we are collaborating with administration to improve the system and create resources for students.",
      links: [
        {
          label: "poster",
          url: "assets/snc-class-2026.pdf",
        },
      ],
    },
    {
      title: "Who is a Brown STEM Student?",
      description:
        "I work with a research team of four [psf] to explore the implicit and explicit cultural practices in STEM spaces at Brown, examining their impact on student belonging, motivation, and self-efficacy through interviews and surveys.",
      links: [],
    },
  ],
  publications: [
    //   {
    //     authors: ["hi there", "self"],
    //     title: "A Cool Paper: Something that I published",
    //     url: "https://dl.acm.org/doi/example",
    //     venue: "NSDI 2019",
    //     venue_url: "https://wisec.acm.org/",
    //     year: 2019,
    //     abstract:
    //       "We present a novel approach to binary analysis that significantly improves detection rates for malware through efficient pattern matching and structural analysis.",
    //     links: [
    //       {
    //         label: "pdf",
    //         url: "assets/papers/paper2022.pdf",
    //       },
    //     ],
    //     bibtex:
    //       "@inproceedings{paper2022,\n  title={Fast Binary Analysis for Malware Detection},\n  author={Edward Nguyen and Bob Williams and Carol Davis},\n  booktitle={Proceedings of the 15th ACM Conference on Security and Privacy in Wireless and Mobile Networks},\n  year={2022}\n}",
    //   },
  ],
  teaching: [
    {
      number: "MATH 0520",
      name: "Linear Algebra",
      semesters: "Fall 2026",
      url: "https://jkostiuk.github.io/Math0520/",
    },
    {
      number: "CSCI 1680",
      name: "Computer Networks",
      semesters: "Spring 2026",
      url: "https://brown-csci1680.github.io/",
    },
    {
      number: "MATH 0520",
      name: "Linear Algebra",
      semesters: "Fall 2025",
      url: "https://jkostiuk.github.io/Math0520/",
    },
    {
      number: "MATH 0520",
      name: "Linear Algebra",
      semesters: "Fall 2024",
      url: "https://jkostiuk.github.io/Math0520/",
    },
  ],
};
