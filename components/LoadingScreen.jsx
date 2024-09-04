import Image from "next/image";

// ----------------------------------------------------------------------

const StyledRoot = {
  right: 0,
  bottom: 0,
  zIndex: 9998,
  width: "100%",
  height: "100%",
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "white",
};
// ----------------------------------------------------------------------

export default function LoadingScreen() {
  return (
    <>
      <div style={StyledRoot}>
        <>
          <div className="relative ">
            <div className="border-4 animate-spin w-[50px] h-[50px]" />

            <div className="absolute top-0 p-2">
              <Image
                src="/logo3.png"
                alt="go home img"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
        </>
      </div>
    </>
  );
}
