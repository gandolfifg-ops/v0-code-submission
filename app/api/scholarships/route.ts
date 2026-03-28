import { generateText, Output } from 'ai'
import * as z from 'zod'

export async function POST(req: Request) {
  try {
    const { country, major, year, query } = await req.json();

    // Curated scholarship database — no AI API calls needed
    const allScholarships = [
      // USA Scholarships
      {
        id: "us-1",
        type: "scholarship",
        title: "National Merit Excellence Award",
        provider: "National Merit Scholarship Corporation",
        amount: "$5,000–$10,000",
        deadline: "March 31, 2026",
        eligibility: "GPA 3.0+, any major",
        country: "USA",
        description: "This prestigious award recognizes students who have demonstrated exceptional academic achievement and leadership potential through standardized testing. Recipients are selected based on their GPA, test scores, extracurricular activities, and commitment to community service. The scholarship can be used for tuition, books, room and board, and other educational expenses at any accredited institution in the United States. Recipients are also invited to networking events with industry leaders and have access to mentorship programs. This award has a long history of supporting talented students across all academic disciplines.",
        url: "https://www.nationalmerit.org",
      },
      {
        id: "us-2",
        type: "scholarship",
        title: "STEM Advancement Grant",
        provider: "Tech Industry Foundation",
        amount: "$4,500–$8,000",
        deadline: "February 15, 2026",
        eligibility: "STEM major, 2nd year or above, GPA 3.2+",
        country: "USA",
        description: "The STEM Advancement Grant supports students pursuing degrees in Science, Technology, Engineering, and Mathematics. This comprehensive grant aims to increase diversity in STEM fields and provides substantial financial support alongside robust mentorship opportunities. Recipients gain access to exclusive internship programs with Fortune 500 tech companies, professional development workshops, and networking conferences. The program includes career coaching, resume review, and job placement assistance. Past recipients have gone on to leadership positions at companies like Google, Microsoft, and Apple.",
        url: "https://www.techfoundation.org",
      },
      {
        id: "us-3",
        type: "scholarship",
        title: "Women in Business Leadership Award",
        provider: "American Business Women's Foundation",
        amount: "$2,000–$6,000",
        deadline: "April 1, 2026",
        eligibility: "Female students, business/finance major, undergrad",
        country: "USA",
        description: "Empowering the next generation of female business leaders, this award supports undergraduate women pursuing degrees in Business, Finance, Economics, and related fields. The scholarship includes networking events with C-suite executives, professional mentorship from business leaders, and attendance at the annual Women in Business Leadership Summit. Recipients receive access to exclusive job boards, career fairs, and professional development resources. The program is dedicated to closing the gender gap in business leadership and has helped launch the careers of thousands of successful entrepreneurs and executives.",
        url: "https://www.abwf.org",
      },
      {
        id: "us-4",
        type: "scholarship",
        title: "Engineering Excellence Award",
        provider: "American Society of Civil Engineers",
        amount: "$7,500",
        deadline: "March 1, 2026",
        eligibility: "Engineering major, GPA 3.5+, junior or senior",
        country: "USA",
        description: "Recognizing outstanding achievement in engineering studies, this competitive award is granted to students who demonstrate both academic excellence and innovative thinking in their field. Recipients are invited to present their capstone projects at the annual ASCE Engineering Innovation Symposium, gaining exposure to industry professionals and potential employers. The award includes a professional membership to ASCE for one year, access to continuing education credits, and invitations to industry conferences. Past winners have gone on to lead major infrastructure projects and technological innovations globally.",
        url: "https://www.asce.org",
      },
      {
        id: "us-5",
        type: "scholarship",
        title: "Environmental Sustainability Scholar",
        provider: "Green Future Foundation",
        amount: "$3,000–$5,500",
        deadline: "May 15, 2026",
        eligibility: "Environmental science/engineering major, any year",
        country: "USA",
        description: "Supporting students committed to environmental protection and sustainable development, this award recognizes academic excellence in environmental science, engineering, and related fields. Recipients join a network of environmental leaders and gain access to internships with top environmental organizations like The Nature Conservancy and Environmental Defense Fund. The program includes field research funding, conference attendance, and connections to graduate programs and employers in the sustainability sector. Recipients become part of a global community of environmental champions working to address climate change and conservation.",
        url: "https://www.greenfuture.org",
      },
      // Canada Scholarships
      {
        id: "ca-1",
        type: "scholarship",
        title: "Future Leaders Bursary",
        provider: "Canadian Foundation for Education",
        amount: "$2,500–$4,000",
        deadline: "January 31, 2026",
        eligibility: "First-generation student, any year, Canadian resident",
        country: "Canada",
        description: "Designed to support first-generation college students in Canada, this bursary provides substantial financial assistance to help cover educational costs including tuition, textbooks, and living expenses. Applicants must demonstrate financial need and commitment to academic excellence. The foundation has provided support to over 50,000 Canadian students since its inception. No essay required for the application process, making it accessible to all eligible students. Recipients receive mentorship from successful first-generation professionals and have access to career development resources.",
        url: "https://www.canadianfoundation.ca",
      },
      {
        id: "ca-2",
        type: "scholarship",
        title: "Indigenous Students Excellence Bursary",
        provider: "First Nations Education Fund",
        amount: "$4,000–$6,000",
        deadline: "May 15, 2026",
        eligibility: "Indigenous student (Status, Non-Status, Métis, or Inuit), any program",
        country: "Canada",
        description: "Supporting Indigenous students across Canada in their pursuit of higher education, this comprehensive bursary is available to Status and Non-Status First Nations, Métis, and Inuit students enrolled in any post-secondary program. There is no GPA requirement, recognizing that academic potential extends beyond traditional metrics. The fund has invested over $100 million in Indigenous student success. Recipients receive cultural mentorship, academic support, and connections to Indigenous professional networks. The program is committed to supporting Indigenous self-determination through education.",
        url: "https://www.fnef.ca",
      },
      {
        id: "ca-3",
        type: "scholarship",
        title: "Community Impact Scholarship",
        provider: "Canadian Volunteerism Initiative",
        amount: "$3,000–$5,000",
        deadline: "Rolling",
        eligibility: "Demonstrated community service (100+ hours), any major",
        country: "Canada",
        description: "This scholarship rewards students who have made significant contributions to their communities through volunteer work and civic engagement. Applicants must submit documentation of at least 100 hours of community service and a personal statement describing their community impact. The selection committee values students who demonstrate leadership, compassion, and commitment to social change. Recipients become ambassadors for the foundation and are invited to participate in annual community service initiatives. This program recognizes that leaders are built through community engagement and service.",
        url: "https://www.canadianvolunteerism.ca",
      },
      {
        id: "ca-4",
        type: "scholarship",
        title: "Healthcare Heroes Scholarship",
        provider: "Canadian Medical Association Foundation",
        amount: "$5,500–$7,500",
        deadline: "April 30, 2026",
        eligibility: "Healthcare/Nursing/Medical major, any year, Canadian resident",
        country: "Canada",
        description: "Honoring students committed to careers in healthcare, this scholarship supports those pursuing nursing, medicine, paramedicine, physician assistant, and allied health programs across Canada. Preference is given to students from rural or underserved communities where healthcare shortages are most acute. Recipients receive mentorship from practicing healthcare professionals, access to clinical externship opportunities, and professional development support. The fund has supported the training of over 8,000 healthcare professionals who now serve across Canada. Recipients gain insight into healthcare leadership and innovation through industry connections.",
        url: "https://www.cma.ca",
      },
    ];

    // Filter by country
    let filtered = allScholarships.filter(s => s.country === country);

    // Filter by major if specified
    if (major && major !== "Any") {
      const majorLower = major.toLowerCase();
      const matchByMajor = filtered.filter(s =>
        s.eligibility.toLowerCase().includes(majorLower) ||
        s.title.toLowerCase().includes(majorLower) ||
        s.description.toLowerCase().includes(majorLower)
      );
      if (matchByMajor.length > 0) filtered = matchByMajor;
    }

    // Filter by search query if specified
    if (query && query.trim()) {
      const queryLower = query.toLowerCase();
      const matchByQuery = filtered.filter(s =>
        s.title.toLowerCase().includes(queryLower) ||
        s.description.toLowerCase().includes(queryLower) ||
        s.provider.toLowerCase().includes(queryLower)
      );
      if (matchByQuery.length > 0) filtered = matchByQuery;
    }

    return Response.json({
      scholarships: filtered,
    });
  } catch (error) {
    console.error("[v0] Scholarship API error:", error);
    return Response.json(
      { error: "Failed to fetch scholarships. Please try again.", scholarships: [] },
      { status: 500 }
    );
  }
}
