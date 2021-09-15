export const Home: React.FC = () => {
  return (
    <div className="w-full bg-white mx-auto px-24">
      <div>
        <img
          draggable={false}
          className="mx-auto"
          src="https://firebasestorage.googleapis.com/v0/b/seogyeong-time.appspot.com/o/mainHeroImg.png?alt=media&token=53ee0b31-ecdb-446b-8c88-c7bad0450859"
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
