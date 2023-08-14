import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({storybook=false}) {

  const objectToAxiosParams = (reviews) => ({
    url: "/api/menuitemreview/post",
    method: "POST",
    params: {
      itemId: reviews.itemId,
      reviewerEmail: reviews.reviewerEmail,
      stars: reviews.stars,
      dateReviewed: reviews.dateReviewed,
      comments: reviews.comments
    }
  });

  const onSuccess = (reviews) => {
    toast(`New review Created - itemId: ${reviews.itemId} reviewerEmail: ${reviews.reviewerEmail} stars: ${reviews.stars} dateReviewed: ${reviews.dateReviewed} comments: ${reviews.comments}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/menuitemreview/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Review</h1>
        <MenuItemReviewForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}

