export const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white mx-auto px-24">
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
        <h2 className="mt-10">
          서경메이트에서는 미팅, 과팅, 스터디, 동아리, 소모임 등 다양한 교류
          활동을 이용해보세요!
        </h2>
      </div>
    </div>
  );
};
