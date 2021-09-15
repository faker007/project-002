export const Home: React.FC = () => {
  return (
    <div className="w-full bg-white mx-auto px-24">
      <div>
        <img
          draggable={false}
          className="mx-auto"
          src="https://firebasestorage.googleapis.com/v0/b/jido-button.appspot.com/o/unnamed.png?alt=media&token=ae6e5221-06d7-4478-b855-3917bafedfba"
        />
      </div>
      <div className="mt-20 text-center ">
        <h1 className="text-7xl font-semibold text-green-500 ">
          대학교 친구가 필요해?!
          <br />
          서경메이트!{" "}
        </h1>
      </div>
    </div>
  );
};
