const menuItemReviewsFixtures = {
    oneReview: [{
        id: 1, 
        itemId: 3, 
        reviewerEmail: "cyrus895@ucsb.edu",
        stars: 5,
        dateReviewed: "2022-01-02T12:00:00",
        comments: "Best food I've ever tasted. Marvelous",
    }],
    threeReviews: [
        {
            id: 1, 
            itemId: 3, 
            reviewerEmail: "cyrus895@ucsb.edu",
            stars: 5,
            dateReviewed: "2022-01-02T12:00:00",
            comments: "Best food I've ever tasted. Marvelous",
        },
        {
            id: 2, 
            itemId: 5, 
            reviewerEmail: "cyrus896@ucsb.edu",
            stars: 1,
            dateReviewed: "2022-04-03T12:00:00",
            comments: "it stinks. I smell a refund.",
        },
        {
            id: 3, 
            itemId: 1, 
            reviewerEmail: "mark@yahoo.com",
            stars: 3,
            dateReviewed: "2022-07-04T12:00:00",
            comments: "simply mid.",
        }
    ]
};

export { menuItemReviewsFixtures };