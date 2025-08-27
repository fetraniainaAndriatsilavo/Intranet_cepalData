export default function Welcome() {
  return (
    <div className="bg-gradient-to-br from-white via-gray-100 to-blue-50 rounded-lg  w-full max-w-screen h-[80vh] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold  tracking-wide font-[Montserrat] drop-shadow-md transition-all">
          Bienvenue sur
        </h1>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-[Montserrat] tracking-tight">
          <span className="bg-sky-600 px-4 py-2 rounded-xl shadow-sm inline-block">
            CEPAL CHAT
          </span>
        </h2>
        <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto font-light">
          Votre espace de discussion moderne, rapide et sécurisé.
        </p>
      </div>
    </div>
  );
}
