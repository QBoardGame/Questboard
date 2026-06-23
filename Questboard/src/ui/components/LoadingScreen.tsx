// export const LoadingScreen = () => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950">
//       <div className="absolute h-96 w-96 animate-pulse rounded-full bg-lime-400/10 blur-3xl" />

//       <div className="relative text-center">
//         <h1 className="animate-[pulse_2s_ease-in-out_infinite] bg-gradient-to-r from-lime-300 via-lime-400 to-yellow-300 bg-clip-text text-7xl font-black tracking-[0.6em] text-transparent">
//           AURUM
//         </h1>

//         <div className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-slate-800">
//           <div className="h-full animate-[loading_1.5s_ease-in-out_infinite] bg-lime-400" />
//         </div>
//       </div>
//     </div>
//   );
// };

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute h-96 w-96 animate-pulse rounded-full bg-lime-400/10 blur-3xl" />

      <div className="relative text-center">
        <h1 className="animate-pulse bg-gradient-to-r from-lime-300 via-lime-400 to-yellow-300 bg-[length:200%_100%] bg-clip-text text-7xl font-black tracking-[0.6em] text-transparent">
          AURUM
        </h1>
      </div>
    </div>
  );
};
