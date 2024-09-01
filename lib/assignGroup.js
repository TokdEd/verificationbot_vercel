function assignGroup(schoolNumber) {
    const schoolPatterns = {
      a: ["台南女中", [[311001, 311637], [312001, 312025]]],
      b: ["台南一中", [310001, 310675]],
      c: ["家齊中學", [[390001, 390069], [310001, 310298], [312001, 312103], [311001, 311107]]],
      d: ["台南二中", [[311001, 311636], [313001, 313023]]]
    };
  
    if (schoolNumber.length < 2) return "未知學校";
  
    const prefix = schoolNumber[0].toLowerCase();
    const num = parseInt(schoolNumber.slice(1), 10);
  
    if (!schoolPatterns[prefix] || isNaN(num)) return "未知學校";
  
    const [schoolName, ranges] = schoolPatterns[prefix];
    
    if (Array.isArray(ranges[0])) {
      for (const [start, end] of ranges) {
        if (num >= start && num <= end) return schoolName;
      }
    } else {
      const [start, end] = ranges;
      if (num >= start && num <= end) return schoolName;
    }
  
    return "未知學校";
  }
  