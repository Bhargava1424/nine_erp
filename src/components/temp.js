const handleSearch = (searchQuery) => {
  if (!searchQuery) {
    return {
      activeStudents: students,
      cancelledStudents: cancelledStudents
    };
  }

  const searchTerms = searchQuery.split(',').map(term => term.trim().toLowerCase());

  const filterStudents = (studentArray) => {
    return studentArray.filter(student => {
      return searchTerms.every(term =>
        student.firstName.toLowerCase().includes(term) ||
        student.applicationNumber.toLowerCase().includes(term) ||
        student.surName.toLowerCase().includes(term) ||
        student.parentName.toLowerCase().includes(term) ||
        student.branch.toLowerCase().includes(term) ||
        student.primaryContact.includes(term) ||
        student.gender.toLowerCase().includes(term) ||
        student.batch.includes(term) ||
        student.course.toLowerCase().includes(term) ||
        student.modeOfResidence.toLowerCase().includes(term) ||
        student.firstYearTuitionFee.toString().includes(term) ||
        student.firstYearHostelFee.toString().includes(term) ||
        student.secondYearTuitionFee.toString().includes(term) ||
        student.secondYearHostelFee.toString().includes(term) ||
        student.pendingFirstYearTuitionFee.toString().includes(term) ||
        student.pendingFirstYearHostelFee.toString().includes(term) ||
        student.pendingSecondYearTuitionFee.toString().includes(term) ||
        student.pendingSecondYearHostelFee.toString().includes(term) ||
        student.paidFirstYearTuitionFee.toString().includes(term) ||
        student.paidFirstYearHostelFee.toString().includes(term) ||
        student.paidSecondYearTuitionFee.toString().includes(term) ||
        student.paidSecondYearHostelFee.toString().includes(term)
      );
    });
  };

  return {
    activeStudents: filterStudents(students),
    cancelledStudents: filterStudents(cancelledStudents)
  };
};