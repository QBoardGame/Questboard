// export const LoadingScreen = () => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950">
//       <div className="absolute h-96 w-96 animate-pulse rounded-full bg-lime-400/10 blur-3xl" />

//       <div className="relative text-center">
//         <h1 className="animate-pulse bg-gradient-to-r from-lime-300 via-lime-400 to-yellow-300 bg-[length:200%_100%] bg-clip-text text-7xl font-black tracking-[0.6em] text-transparent">
//           AURUM
//         </h1>
//       </div>
//     </div>
//   );
// };


export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background glow */}
      <div className="absolute h-64 w-64 rounded-full bg-lime-400/10 blur-3xl sm:h-80 sm:w-80 md:h-96 md:w-96 animate-pulse" />

      <div className="relative text-center px-4">
        <h1 className="animate-pulse bg-gradient-to-r from-lime-300 via-lime-400 to-yellow-300 bg-[length:200%_100%] bg-clip-text text-4xl font-black tracking-[0.08em] text-transparent sm:text-5xl sm:tracking-[0.12em] md:text-6xl lg:text-7xl lg:tracking-[0.18em]">
          RuneRush
        </h1>
      </div>
    </div>
  );
};