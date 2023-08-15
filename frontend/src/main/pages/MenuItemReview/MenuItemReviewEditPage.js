import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from 'main/components/MenuItemReview/MenuItemReviewForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: reviews, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/menuitemreview?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/menuitemreview`,
                params: {
                    id: id,
                }
            },
        );

    const objectToAxiosPutParams = (reviews) => ({
        url: "/api/menuitemreview",
        method: "PUT",
        params: {
            id: reviews.id,
        },
        data: {
          itemId: reviews.itemId,
          reviewerEmail: reviews.reviewerEmail,
          stars: reviews.stars,
          dateReviewed: reviews.dateReviewed,
          comments: reviews.comments
        }
    });

    const onSuccess = (reviews) => {
        toast(`Review Updated - itemId: ${reviews.itemId} reviewerEmail: ${reviews.reviewerEmail} stars: ${reviews.stars} dateReviewed: ${reviews.dateReviewed} comments: ${reviews.comments}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/menuitemreview?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (reviews) => {
        mutation.mutate(reviews);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/menuitemreview" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Review</h1>
                {
                    reviews && <MenuItemReviewForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={reviews} />
                }
            </div>
        </BasicLayout>
    )

}
