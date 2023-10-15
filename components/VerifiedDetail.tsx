const VerifiedDetail = ({
  label,
  total,
}: {
  label: string;
  total: number | JSX.Element;
}) => {
  return (
    <div className="bg-black text-white p-1 rounded-md text-center min-w-[100px]">
      <p className="mb-2 font-semibold text-lg">{label}</p>
      <p className="text-2xl font-bold text-green-500">{total}</p>
    </div>
  );
};
export default VerifiedDetail;
