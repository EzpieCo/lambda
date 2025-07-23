import CommentSection from "@/components/Post/CommentSection";
import PostRenderer from "@/app/post/[postId]/PostPageRenderer";

// Tell's vercel that this is a dynamic function
export const dynamic = "force-dynamic";

/**
 * Displays the selected posts
 *
 * @param {string} params.postId - the id of the post which is selected
 *
 * @returns JSX.Element
 */
export default function Page({ params }: { params: { postId: string } }) {

  /* eslint-disable max-len */
  return (
    <div>
      <div className="md:flex justify-between md:mx-2 mx-1 my-4 pb-10 post-divider">
        <PostRenderer postId={params.postId} />
      </div>
      <div className="ml-[17rem]">
        <CommentSection postId={params.postId} />
      </div>
    </div>
  );
}
