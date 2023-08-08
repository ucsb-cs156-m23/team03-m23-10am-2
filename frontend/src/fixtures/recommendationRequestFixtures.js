const recommendationRequestFixtures = {
    oneRequest: {
        "id": 1,
        "requesterEmail": "student@ucsb.edu",
        "professorEmail": "prof@ucsb.edu",
        "explanation": "very_good_explanation",
        "dateRequested": "2023-12-01T13:15:00",
        "dateNeeded": "2023-12-01T13:25:00",
        "done": true
      },
    threeDates: [
        {
            "id": 1,
            "requesterEmail": "student1@ucsb.edu",
            "professorEmail": "prof1@ucsb.edu",
            "explanation": "another_explanation",
            "dateRequested": "2023-12-01T13:13:00",
            "dateNeeded": "2023-12-01T13:27:00",
            "done": false
        },
        {
            "id": 2,
            "requesterEmail": "student2@ucsb.edu",
            "professorEmail": "prof2@ucsb.edu",
            "explanation": "yet_another_explanation",
            "dateRequested": "2023-12-01T13:16:00",
            "dateNeeded": "2023-12-01T13:29:00",
            "done": true
        },
        {
            "id": 3,
            "requesterEmail": "student3@ucsb.edu",
            "professorEmail": "prof3@ucsb.edu",
            "explanation": "bad_explanation",
            "dateRequested": "2023-12-01T13:14:00",
            "dateNeeded": "2023-12-01T13:28:00",
            "done": false
        }
    ]
};


export { recommendationRequestFixtures };