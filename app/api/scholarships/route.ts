export async function POST(req: Request) {
  try {
    const { country, major, level, year, query, offset = 0, limit = 10 } = await req.json();
    // Support both 'level' (new) and 'year' (legacy) parameter names
    const studyLevel = level ?? year;

    const allScholarships = [
      // ═══════════════════════════ USA SCHOLARSHIPS ═══════════════════════════

      // --- STEM ---
      { id:"us-stem-1", type:"scholarship", title:"National Merit Excellence Award", provider:"National Merit Scholarship Corporation", amount:"$5,000–$10,000", deadline:"March 31, 2026", eligibility:"GPA 3.0+, any major", country:"USA", field:"general", description:"This prestigious award recognizes students who have demonstrated exceptional academic achievement and leadership potential through standardized testing. Recipients are selected based on their GPA, test scores, extracurricular activities, and commitment to community service. The scholarship can be used for tuition, books, room and board, and other educational expenses at any accredited institution in the United States. Recipients are also invited to networking events with industry leaders and have access to mentorship programs. This award has a long history of supporting talented students across all academic disciplines.", url:"https://www.nationalmerit.org" },
      { id:"us-stem-2", type:"scholarship", title:"STEM Advancement Grant", provider:"Tech Industry Foundation", amount:"$4,500–$8,000", deadline:"May 15, 2026", eligibility:"STEM major, 2nd year or above, GPA 3.2+", country:"USA", field:"stem", description:"The STEM Advancement Grant supports students pursuing degrees in Science, Technology, Engineering, and Mathematics. This comprehensive grant aims to increase diversity in STEM fields and provides substantial financial support alongside robust mentorship opportunities. Recipients gain access to exclusive internship programs with Fortune 500 tech companies, professional development workshops, and networking conferences. The program includes career coaching, resume review, and job placement assistance. Past recipients have gone on to leadership positions at companies like Google, Microsoft, and Apple.", url:"https://www.techfoundation.org" },
      { id:"us-stem-3", type:"scholarship", title:"Future Scientists of America Award", provider:"American Association for the Advancement of Science", amount:"$6,000–$12,000", deadline:"April 15, 2026", eligibility:"Science major, undergraduate or graduate, research experience preferred", country:"USA", field:"stem", description:"Supporting the next generation of scientific researchers, this award recognizes students who have demonstrated exceptional promise in scientific inquiry and research. Recipients receive funding for research projects, conference attendance, and publication costs. The program connects students with mentors from leading research institutions including MIT, Stanford, and the National Institutes of Health.", url:"https://www.aaas.org" },
      { id:"us-stem-4", type:"scholarship", title:"Women in Technology Leadership Scholarship", provider:"National Center for Women & Information Technology", amount:"$5,000–$10,000", deadline:"July 1, 2026", eligibility:"Female students, computer science/IT major, any year", country:"USA", field:"stem", description:"Empowering women in technology fields, this scholarship supports female students pursuing degrees in computer science, information technology, cybersecurity, and related fields. Recipients gain access to an extensive network of women tech leaders, exclusive mentorship programs, and invitations to industry conferences.", url:"https://www.ncwit.org" },
      { id:"us-stem-5", type:"scholarship", title:"Mathematics Excellence Award", provider:"American Mathematical Society", amount:"$3,500–$7,000", deadline:"June 28, 2026", eligibility:"Mathematics major, GPA 3.5+, undergraduate", country:"USA", field:"stem", description:"Recognizing exceptional talent in mathematics, this award supports undergraduates who demonstrate both academic excellence and a passion for mathematical research. Recipients receive funding for research projects, summer programs, and graduate school preparation.", url:"https://www.ams.org" },

      // --- Engineering ---
      { id:"us-eng-1", type:"scholarship", title:"Engineering Excellence Award", provider:"American Society of Civil Engineers", amount:"$7,500", deadline:"July 1, 2026", eligibility:"Engineering major, GPA 3.5+, junior or senior", country:"USA", field:"engineering", description:"Recognizing outstanding achievement in engineering studies, this competitive award is granted to students who demonstrate both academic excellence and innovative thinking in their field. Recipients are invited to present their capstone projects at the annual ASCE Engineering Innovation Symposium.", url:"https://www.asce.org" },
      { id:"us-eng-2", type:"scholarship", title:"Mechanical Engineering Innovation Grant", provider:"American Society of Mechanical Engineers", amount:"$5,000–$8,000", deadline:"April 1, 2026", eligibility:"Mechanical engineering major, 3rd year or above", country:"USA", field:"engineering", description:"Supporting innovative mechanical engineering students, this grant provides funding for research projects, prototype development, and conference attendance. Recipients gain access to ASME's extensive professional network and are paired with mentors from leading engineering firms.", url:"https://www.asme.org" },
      { id:"us-eng-3", type:"scholarship", title:"Electrical Engineering Future Leaders Award", provider:"Institute of Electrical and Electronics Engineers", amount:"$4,000–$9,000", deadline:"July 15, 2026", eligibility:"Electrical/computer engineering major, any year", country:"USA", field:"engineering", description:"Recognizing future leaders in electrical and computer engineering, this award supports students with demonstrated academic excellence and leadership potential. Recipients receive IEEE membership, access to technical publications, and invitations to international conferences.", url:"https://www.ieee.org" },
      { id:"us-eng-4", type:"scholarship", title:"Aerospace Engineering Excellence Scholarship", provider:"American Institute of Aeronautics and Astronautics", amount:"$6,000–$12,000", deadline:"June 1, 2026", eligibility:"Aerospace engineering major, GPA 3.4+, undergraduate or graduate", country:"USA", field:"engineering", description:"Supporting the next generation of aerospace engineers, this scholarship recognizes students with exceptional academic achievement and a passion for aviation and space exploration. The program provides connections to NASA, SpaceX, Boeing, and other aerospace leaders.", url:"https://www.aiaa.org" },

      // --- Business ---
      { id:"us-bus-1", type:"scholarship", title:"Women in Business Leadership Award", provider:"American Business Women's Foundation", amount:"$2,000–$6,000", deadline:"April 1, 2026", eligibility:"Female students, business/finance major, undergrad", country:"USA", field:"business", description:"Empowering the next generation of female business leaders, this award supports undergraduate women pursuing degrees in Business, Finance, Economics, and related fields. The scholarship includes networking events with C-suite executives and professional mentorship from business leaders.", url:"https://www.abwf.org" },
      { id:"us-bus-2", type:"scholarship", title:"Entrepreneurship Innovation Award", provider:"Kauffman Foundation", amount:"$5,000–$15,000", deadline:"May 1, 2026", eligibility:"Business/entrepreneurship major, startup experience preferred", country:"USA", field:"business", description:"Supporting aspiring entrepreneurs, this award recognizes students who have demonstrated innovative thinking and entrepreneurial drive. Recipients receive funding for business development, access to startup incubators, and mentorship from successful entrepreneurs.", url:"https://www.kauffman.org" },
      { id:"us-bus-3", type:"scholarship", title:"Finance Leaders of Tomorrow Scholarship", provider:"CFA Institute", amount:"$4,000–$8,000", deadline:"July 15, 2026", eligibility:"Finance/accounting major, GPA 3.3+, junior or senior", country:"USA", field:"business", description:"Preparing the next generation of finance professionals, this scholarship supports students pursuing careers in investment management, financial analysis, and corporate finance. Recipients receive study materials for the CFA exam and mentorship from CFA charterholders.", url:"https://www.cfainstitute.org" },

      // --- Healthcare ---
      { id:"us-health-1", type:"scholarship", title:"Nursing Excellence Scholarship", provider:"American Nurses Foundation", amount:"$5,000–$10,000", deadline:"April 15, 2026", eligibility:"Nursing major, any year, US citizen", country:"USA", field:"healthcare", description:"Supporting dedicated nursing students, this scholarship recognizes academic excellence and commitment to patient care. Recipients receive funding for tuition, clinical equipment, and professional development.", url:"https://www.nursingworld.org" },
      { id:"us-health-2", type:"scholarship", title:"Pre-Medical Excellence Award", provider:"American Medical Association Foundation", amount:"$8,000–$15,000", deadline:"July 1, 2026", eligibility:"Pre-med student, GPA 3.6+, MCAT score 510+", country:"USA", field:"healthcare", description:"Preparing future physicians for excellence in medicine, this award supports outstanding pre-medical students. Recipients receive funding for medical school applications, MCAT preparation, and clinical experiences.", url:"https://www.amafoundation.org" },
      { id:"us-health-3", type:"scholarship", title:"Public Health Leadership Scholarship", provider:"American Public Health Association", amount:"$3,500–$7,000", deadline:"June 28, 2026", eligibility:"Public health major, any year, undergraduate or graduate", country:"USA", field:"healthcare", description:"Supporting future public health leaders, this scholarship recognizes students committed to improving community health outcomes.", url:"https://www.apha.org" },
      { id:"us-health-4", type:"scholarship", title:"Pharmacy Excellence Award", provider:"American Pharmacists Association Foundation", amount:"$4,000–$8,000", deadline:"April 1, 2026", eligibility:"Pharmacy student, any year, GPA 3.2+", country:"USA", field:"healthcare", description:"Recognizing excellence in pharmaceutical studies, this award supports students pursuing careers in pharmacy practice, research, and industry.", url:"https://www.aphafoundation.org" },

      // --- Environmental ---
      { id:"us-env-1", type:"scholarship", title:"Environmental Sustainability Scholar", provider:"Green Future Foundation", amount:"$3,000–$5,500", deadline:"May 15, 2026", eligibility:"Environmental science/engineering major, any year", country:"USA", field:"environmental", description:"Supporting students committed to environmental protection and sustainable development, this award recognizes academic excellence in environmental science, engineering, and related fields.", url:"https://www.greenfuture.org" },
      { id:"us-env-2", type:"scholarship", title:"Climate Action Leadership Award", provider:"Environmental Defense Fund", amount:"$5,000–$10,000", deadline:"July 15, 2026", eligibility:"Environmental/sustainability major, demonstrated climate activism", country:"USA", field:"environmental", description:"Recognizing student leaders in climate action, this award supports those who have demonstrated both academic excellence and commitment to addressing climate change.", url:"https://www.edf.org" },

      // --- Arts/Humanities ---
      { id:"us-arts-1", type:"scholarship", title:"Creative Arts Excellence Award", provider:"National Endowment for the Arts", amount:"$3,000–$7,500", deadline:"April 1, 2026", eligibility:"Fine arts/performing arts major, portfolio required", country:"USA", field:"arts", description:"Supporting exceptional artists, this award recognizes students who demonstrate outstanding creative talent and artistic vision.", url:"https://www.arts.gov" },
      { id:"us-arts-2", type:"scholarship", title:"Humanities Research Fellowship", provider:"National Endowment for the Humanities", amount:"$4,000–$8,000", deadline:"May 15, 2026", eligibility:"Humanities major, GPA 3.4+, research project required", country:"USA", field:"humanities", description:"Supporting humanities research, this fellowship recognizes students with exceptional scholarly promise in history, philosophy, literature, and related fields.", url:"https://www.neh.gov" },

      // --- General USA ---
      { id:"us-gen-1", type:"scholarship", title:"First Generation College Student Award", provider:"College Success Foundation", amount:"$2,500–$5,000", deadline:"Rolling", eligibility:"First-generation college student, any major", country:"USA", field:"general", description:"Supporting first-generation college students, this award recognizes the unique challenges and achievements of students who are the first in their families to pursue higher education.", url:"https://www.collegesuccessfoundation.org" },
      { id:"us-gen-2", type:"scholarship", title:"Community Service Leadership Scholarship", provider:"Points of Light Foundation", amount:"$3,000–$6,000", deadline:"March 31, 2026", eligibility:"Demonstrated community service (150+ hours), any major", country:"USA", field:"general", description:"Recognizing students who have made significant contributions to their communities, this scholarship supports those with demonstrated leadership in volunteer service.", url:"https://www.pointsoflight.org" },
      { id:"us-gen-3", type:"scholarship", title:"Minority Excellence Scholarship", provider:"United Negro College Fund", amount:"$5,000–$10,000", deadline:"April 15, 2026", eligibility:"Underrepresented minority student, any major, GPA 2.5+", country:"USA", field:"general", description:"Supporting underrepresented minority students in higher education, this scholarship provides substantial financial assistance and professional development opportunities.", url:"https://www.uncf.org" },

      // ═══════════════════════════ CANADA SCHOLARSHIPS ═══════════════════════

      // --- General Canada ---
      { id:"ca-gen-1", type:"scholarship", title:"Future Leaders Bursary", provider:"Canadian Foundation for Education", amount:"$2,500–$4,000", deadline:"January 31, 2026", eligibility:"First-generation student, any year, Canadian resident", country:"Canada", field:"general", description:"Designed to support first-generation college students in Canada, this bursary provides substantial financial assistance to help cover educational costs including tuition, textbooks, and living expenses.", url:"https://www.canadianfoundation.ca" },
      { id:"ca-gen-2", type:"scholarship", title:"Indigenous Students Excellence Bursary", provider:"First Nations Education Fund", amount:"$4,000–$6,000", deadline:"May 15, 2026", eligibility:"Indigenous student (Status, Non-Status, Métis, or Inuit), any program", country:"Canada", field:"general", description:"Supporting Indigenous students across Canada in their pursuit of higher education, this comprehensive bursary is available to Status and Non-Status First Nations, Métis, and Inuit students enrolled in any post-secondary program.", url:"https://www.fnef.ca" },
      { id:"ca-gen-3", type:"scholarship", title:"Community Impact Scholarship", provider:"Canadian Volunteerism Initiative", amount:"$3,000–$5,000", deadline:"Rolling", eligibility:"Demonstrated community service (100+ hours), any major", country:"Canada", field:"general", description:"This scholarship rewards students who have made significant contributions to their communities through volunteer work and civic engagement.", url:"https://www.canadianvolunteerism.ca" },
      { id:"ca-gen-4", type:"scholarship", title:"Loran Scholars Foundation Award", provider:"Loran Scholars Foundation", amount:"$100,000 (over 4 years)", deadline:"October 15, 2026", eligibility:"High school senior, Canadian citizen, leadership demonstrated", country:"Canada", field:"general", description:"Canada's largest and most comprehensive undergraduate award, the Loran Award recognizes students with exceptional character, service, and leadership potential. Recipients receive full tuition plus substantial living allowances for four years.", url:"https://www.loranscholar.ca" },

      // --- Healthcare Canada ---
      { id:"ca-health-1", type:"scholarship", title:"Healthcare Heroes Scholarship", provider:"Canadian Medical Association Foundation", amount:"$5,500–$7,500", deadline:"April 30, 2026", eligibility:"Healthcare/Nursing/Medical major, any year, Canadian resident", country:"Canada", field:"healthcare", description:"Honoring students committed to careers in healthcare, this scholarship supports those pursuing nursing, medicine, paramedicine, physician assistant, and allied health programs across Canada.", url:"https://www.cma.ca" },
      { id:"ca-health-2", type:"scholarship", title:"Nursing Future Leaders Award", provider:"Canadian Nurses Foundation", amount:"$3,000–$6,000", deadline:"July 15, 2026", eligibility:"Nursing student, any year, Canadian citizen or permanent resident", country:"Canada", field:"healthcare", description:"Supporting the next generation of nursing leaders in Canada, this award recognizes students who demonstrate academic excellence and commitment to patient care.", url:"https://www.cnf-fiic.ca" },
      { id:"ca-health-3", type:"scholarship", title:"Canadian Medical Foundation Bursary", provider:"Canadian Medical Foundation", amount:"$8,000–$12,000", deadline:"June 1, 2026", eligibility:"Medical student, Canadian medical school, financial need demonstrated", country:"Canada", field:"healthcare", description:"Supporting medical students with demonstrated financial need, this bursary helps reduce the significant debt burden associated with medical education.", url:"https://www.cmf.ca" },

      // --- STEM Canada ---
      { id:"ca-stem-1", type:"scholarship", title:"NSERC Undergraduate Research Award", provider:"Natural Sciences and Engineering Research Council", amount:"$6,250 (16 weeks)", deadline:"June 28, 2026", eligibility:"STEM major, undergraduate, research project with faculty supervisor", country:"Canada", field:"stem", description:"Canada's premier undergraduate research funding, this award supports students conducting research in natural sciences and engineering.", url:"https://www.nserc-crsng.gc.ca" },
      { id:"ca-stem-2", type:"scholarship", title:"Women in STEM Canada Award", provider:"Society for Canadian Women in Science and Technology", amount:"$4,000–$7,000", deadline:"March 31, 2026", eligibility:"Female student, STEM major, Canadian resident", country:"Canada", field:"stem", description:"Empowering women in STEM fields across Canada, this award supports female students pursuing degrees in science, technology, engineering, and mathematics.", url:"https://www.scwist.ca" },
      { id:"ca-stem-3", type:"scholarship", title:"Computer Science Excellence Award", provider:"Canadian Association of Computer Science", amount:"$5,000–$8,000", deadline:"April 1, 2026", eligibility:"Computer science major, GPA 3.5+, undergraduate", country:"Canada", field:"stem", description:"Recognizing exceptional computer science students, this award supports those who demonstrate academic excellence and innovation in computing.", url:"https://www.cs-can.ca" },

      // --- Engineering Canada ---
      { id:"ca-eng-1", type:"scholarship", title:"Engineers Canada Scholarship", provider:"Engineers Canada", amount:"$5,000–$10,000", deadline:"July 1, 2026", eligibility:"Engineering major, GPA 3.4+, Canadian institution", country:"Canada", field:"engineering", description:"Supporting outstanding engineering students across Canada, this scholarship recognizes academic excellence and commitment to the engineering profession.", url:"https://www.engineerscanada.ca" },
      { id:"ca-eng-2", type:"scholarship", title:"Civil Engineering Leadership Award", provider:"Canadian Society for Civil Engineering", amount:"$4,000–$6,000", deadline:"May 15, 2026", eligibility:"Civil engineering major, junior or senior, Canadian resident", country:"Canada", field:"engineering", description:"Recognizing future leaders in civil engineering, this award supports students who demonstrate both academic excellence and leadership potential.", url:"https://www.csce.ca" },

      // --- Business Canada ---
      { id:"ca-bus-1", type:"scholarship", title:"Canadian Business Excellence Award", provider:"Canadian Chamber of Commerce", amount:"$3,500–$7,000", deadline:"April 15, 2026", eligibility:"Business/commerce major, GPA 3.3+, undergraduate", country:"Canada", field:"business", description:"Supporting future business leaders in Canada, this award recognizes students who demonstrate academic excellence and leadership in business studies.", url:"https://www.chamber.ca" },
      { id:"ca-bus-2", type:"scholarship", title:"Entrepreneurship Innovation Bursary", provider:"Futurpreneur Canada", amount:"$5,000–$10,000", deadline:"March 31, 2026", eligibility:"Business/entrepreneurship major, startup project required", country:"Canada", field:"business", description:"Supporting young entrepreneurs across Canada, this bursary recognizes students with innovative business ideas and entrepreneurial drive.", url:"https://www.futurpreneur.ca" },
      { id:"ca-bus-3", type:"scholarship", title:"Finance Leadership Scholarship", provider:"CFA Society Canada", amount:"$4,000–$8,000", deadline:"June 28, 2026", eligibility:"Finance/accounting major, GPA 3.4+, junior or senior", country:"Canada", field:"business", description:"Preparing future finance leaders in Canada, this scholarship supports students pursuing careers in investment management, financial analysis, and corporate finance.", url:"https://www.cfasociety.org/canada" },

      // --- Arts Canada ---
      { id:"ca-arts-1", type:"scholarship", title:"Canada Council Arts Award", provider:"Canada Council for the Arts", amount:"$5,000–$10,000", deadline:"April 1, 2026", eligibility:"Fine arts/performing arts major, portfolio required, Canadian citizen", country:"Canada", field:"arts", description:"Supporting exceptional Canadian artists, this award recognizes students who demonstrate outstanding creative talent and artistic vision.", url:"https://www.canadacouncil.ca" },
      { id:"ca-arts-2", type:"scholarship", title:"Social Sciences and Humanities Research Award", provider:"Social Sciences and Humanities Research Council", amount:"$6,000 (16 weeks)", deadline:"May 15, 2026", eligibility:"Humanities/social sciences major, research project required", country:"Canada", field:"humanities", description:"Canada's premier funding for undergraduate research in humanities and social sciences, this award supports students conducting research under faculty supervision.", url:"https://www.sshrc-crsh.gc.ca" },

      // --- Environmental Canada ---
      { id:"ca-env-1", type:"scholarship", title:"Environmental Excellence Bursary", provider:"David Suzuki Foundation", amount:"$3,500–$6,000", deadline:"May 1, 2026", eligibility:"Environmental science/studies major, demonstrated environmental advocacy", country:"Canada", field:"environmental", description:"Supporting students committed to environmental protection and sustainability in Canada, this bursary recognizes academic excellence and environmental advocacy.", url:"https://www.davidsuzuki.org" },
      { id:"ca-env-2", type:"scholarship", title:"Sustainable Development Scholarship", provider:"Sustainable Development Technology Canada", amount:"$5,000–$8,000", deadline:"July 15, 2026", eligibility:"Environmental engineering/sustainability major, research project required", country:"Canada", field:"environmental", description:"Supporting students working on sustainable development solutions, this scholarship recognizes innovation in clean technology and environmental sustainability.", url:"https://www.sdtc.ca" },
    ];

    // Filter by country (strict)
    let filtered = allScholarships.filter(s => s.country === country);

    // Filter out expired deadlines
    const today = new Date();
    filtered = filtered.filter(s => {
      if (s.deadline === "Rolling") return true;
      try {
        const deadlineDate = new Date(s.deadline);
        return deadlineDate >= today;
      } catch { return true; }
    });

    // Filter by field/major
    if (major && major !== "Any") {
      const majorLower = major.toLowerCase();
      const fieldMapping: Record<string, string[]> = {
        "stem": ["stem", "general"],
        "engineering": ["engineering", "stem", "general"],
        "business": ["business", "general"],
        "arts": ["arts", "humanities", "general"],
        "healthcare": ["healthcare", "general"],
        "nursing": ["healthcare", "general"],
        "environmental": ["environmental", "stem", "general"],
        "computer science": ["stem", "general"],
        "finance": ["business", "general"],
        "medicine": ["healthcare", "general"],
        "law": ["humanities", "general"],
      };
      const matchingFields = Object.entries(fieldMapping).find(([key]) =>
        majorLower.includes(key) || key.includes(majorLower)
      )?.[1] || ["general"];
      filtered = filtered.filter(s =>
        matchingFields.includes(s.field) ||
        s.eligibility.toLowerCase().includes(majorLower) ||
        s.title.toLowerCase().includes(majorLower) ||
        s.description.toLowerCase().includes(majorLower)
      );
    }

    // Filter by search query
    if (query && query.trim()) {
      const queryLower = query.toLowerCase();
      const queryFiltered = filtered.filter(s =>
        s.title.toLowerCase().includes(queryLower) ||
        s.description.toLowerCase().includes(queryLower) ||
        s.provider.toLowerCase().includes(queryLower) ||
        s.eligibility.toLowerCase().includes(queryLower)
      );
      if (queryFiltered.length > 0) filtered = queryFiltered;
    }

    // Negative keyword filtering
    if (query && query.trim()) {
      const queryLower = query.toLowerCase();
      const negationPatterns = [
        /\b(?:i am |i'm |i )not\s+(?:a |an )?(\w+)/gi,
        /\bnot\s+(?:a |an )?(\w+)/gi,
        /\bnon[- ]?(\w+)/gi,
        /\bno\s+(\w+)/gi,
        /\bnever\s+(\w+)/gi,
        /\bwithout\s+(?:being |having )?(?:a |an )?(\w+)/gi,
        /\bexclude\s+(\w+)/gi,
        /\bexcluding\s+(\w+)/gi,
      ];
      const excludeTerms: string[] = [];
      for (const pattern of negationPatterns) {
        let match;
        while ((match = pattern.exec(queryLower)) !== null) {
          const term = match[1]?.trim().toLowerCase();
          if (term && term.length > 2) excludeTerms.push(term);
        }
      }
      const demographicTerms = [
        "indigenous","aboriginal","native","first nations","metis","inuit",
        "international","foreign","immigrant","refugee",
        "female","women","woman","male","men","man",
        "black","african","hispanic","latino","latina","asian","minority",
        "lgbtq","lgbt","queer","transgender",
        "veteran","military","disabled","disability",
        "citizen","resident","permanent"
      ];
      if (excludeTerms.length > 0) {
        filtered = filtered.filter(scholarship => {
          const searchableText = (
            scholarship.title + " " + scholarship.description + " " +
            scholarship.eligibility + " " + scholarship.provider
          ).toLowerCase();
          for (const term of excludeTerms) {
            const isDemographic = demographicTerms.some(d => term.includes(d) || d.includes(term));
            if (isDemographic && searchableText.includes(term)) return false;
            if (scholarship.eligibility.toLowerCase().includes(term) || scholarship.title.toLowerCase().includes(term)) return false;
          }
          return true;
        });
      }
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return Response.json({ scholarships: paginated, total, hasMore, nextOffset: hasMore ? offset + limit : null });
  } catch (error) {
    console.error("[v0] Scholarship API error:", error);
    return Response.json(
      { error: "Failed to fetch scholarships. Please try again.", scholarships: [], total: 0, hasMore: false },
      { status: 500 }
    );
  }
}
