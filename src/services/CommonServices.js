export default {
  checkMandatoryFields(resume) {
    if (!resume.profileSummary || resume.profileSummary?.trim() === "") {
      return "Summary";
    }

    const education = JSON.parse(resume.education);
    if (!education || education.length === 0) {
      return "At least one Education";
    }
    for (let edu of education) {
      if (!edu.institutionName || edu.institutionName?.trim() === "") {
        return "Institution Name in Education";
      }
      if (!edu.degree || edu.degree?.trim() === "") {
        return "Degree in Education";
      }
      if (!edu.course || edu.course?.trim() === "") {
        return "Course in Education";
      }
      if (!edu.startDate) {
        return "Start Date in Education";
      }
      if (!edu.gpa || edu.gpa?.trim() === "") {
        return "GPA/Percentage in Education";
      }
      if (!edu.address || edu.address?.trim() === "") {
        return "Address in Education";
      }
    }

    const experience = JSON.parse(resume.experience);
    if (experience && experience.length > 0) {
      for (let exp of experience) {
        if (!exp.company || exp.company?.trim() === "") {
          return "Company in Experience";
        }
        if (!exp.designation || exp.designation?.trim() === "") {
          return "Designation in Experience";
        }
        if (!exp.startDate) {
          return "Start Date in Experience";
        }
        if (!exp.address || exp.address?.trim() === "") {
          return "Address in Experience";
        }
      }
    }

    if (resume?.templateType == 3) {
      const projects = JSON.parse(resume.projects);
      if (projects && projects.length > 0) {
        for (let project of projects) {
          if (!project.company || project.company?.trim() === "") {
            return "Company in Projects";
          }
          if (!project.role || project.role?.trim() === "") {
            return "Role in Projects";
          }
          if (!project.startDate) {
            return "Start Date in Projects";
          }
          if (!project.address || project.address?.trim() === "") {
            return "Address in Projects";
          }
        }
      }
    }

    if (resume?.templateType == 4) {
      const awards = JSON.parse(resume.awards);
      if (awards && awards.length > 0) {
        for (let award of awards) {
          if (!award.title || award.title?.trim() === "") {
            return "Name in Awards/Honors";
          }
          if (!award.date) {
            return "Received Date in Awards/Honors";
          }
        }
      }
    }
    return "cool";
  },

  checkFeedbackFields(staffFeedbacks) {
    for (let feedback of staffFeedbacks) {
      if (!feedback.comments || feedback.comments?.trim() === "") {
        return "Comments in Feedback";
      }
    }
    return "cool";
  },

  checkEducation(education) {
    for (let edu of education) {
      if (!edu.institutionName || edu.institutionName?.trim() === "") {
        return "Institution Name in Education";
      }
      if (!edu.degree || edu.degree?.trim() === "") {
        return "Degree in Education";
      }
      if (!edu.course || edu.course?.trim() === "") {
        return "Course in Education";
      }
      if (!edu.startDate) {
        return "Start Date in Education";
      }
      if (!edu.gpa || edu.gpa?.trim() === "") {
        return "GPA/Percentage in Education";
      }
      if (!edu.address || edu.address?.trim() === "") {
        return "Address in Education";
      }
    }
    return "cool";
  },

  checkCertificates(certificates) {
    for (let cert of certificates) {
      if (!cert.name || cert.name?.trim() === "") {
        return "Name in Certificate";
      }
      if (!cert.issuedBy || cert.issuedBy?.trim() === "") {
        return "Issued By in Certificate";
      }
      if (!cert.grade || cert.grade?.trim() === "") {
        return "Grade/Percentage in Certificate";
      }
      if (!cert.startDate) {
        return "Start Date in Certificate";
      }
    }
    return "cool";
  },

  checkAwards(awards) {
    for (let award of awards) {
      if (!award.title || award.name?.trim() === "") {
        return "Title in Awards";
      }
      if (!award.issuedBy || award.issuedBy?.trim() === "") {
        return "Issued By in Awards";
      }
      if (!award.date) {
        return "Issued Date in Awards";
      }
    }
    return "cool";
  },

  checkExperience(experience) {
    for (let exp of experience) {
      if (!exp.company || exp.company?.trim() === "") {
        return "Company in Experience";
      }
      if (!exp.designation || exp.designation?.trim() === "") {
        return "Designation in Experience";
      }
      if (!exp.startDate) {
        return "Start Date in Experience";
      }
      if (!exp.address || exp.address?.trim() === "") {
        return "Address in Experience";
      }
    }
    return "cool";
  },

  checkProjects(projects) {
    for (let project of projects) {
      if (!project.company || project.company?.trim() === "") {
        return "Company in Projects";
      }
      if (!project.title || project.title?.trim() === "") {
        return "Title in Projects";
      }
      if (!project.startDate) {
        return "Start Date in Projects";
      }
    }
    return "cool";
  },
};
