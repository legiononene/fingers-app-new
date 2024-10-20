type Variables = {
  deleteId: string;
  token: string;
};

type Props = {
  deleteTitle: string;
  token: string;
  deleteId: string;
  deleteFunction: (options: { variables: Variables }) => void;
  deleteLoading: boolean;
  cancelFunction: (value: { id: string } | null) => void;
};

const ConfirmDelete = ({
  deleteTitle,
  token,
  deleteId,
  deleteFunction,
  deleteLoading,
  cancelFunction,
}: Props) => {
  return (
    <div className="confirm-delete">
      <p className="info-text">
        Are you sure you want to delete this {deleteTitle}?
      </p>
      <div className="buttons">
        <button
          title={`Confirm Delete this ${deleteTitle}`}
          className="delete"
          onClick={() => {
            deleteFunction({
              variables: {
                token,
                deleteId,
              },
            });
          }}
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "Confirm"}
        </button>
        <button
          title={`Cancle Delete this ${deleteTitle}`}
          onClick={() => cancelFunction(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
