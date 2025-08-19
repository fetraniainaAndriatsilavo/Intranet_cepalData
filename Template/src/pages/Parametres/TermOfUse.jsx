export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="bg-white max-w-3xl mx-auto p-10 rounded-lg shadow-md">
        <h1 className="text-center text-2xl text-gray-800 uppercase tracking-wider mb-8 font-bold">
          Conditions Générales d&apos;Utilisation
        </h1>

        <Section
          title="1. Objet :"
          content={
            <>
              <p>
                Les présentes Conditions Générales d&apos;Utilisation (CGU) ont pour objet de définir les modalités et les conditions d&apos;accès et d&apos;utilisation de l&apos;intranet mis à disposition par{" "}
                <span className="font-bold text-blue-600">EXTEDIM MADAGASCAR</span>.
              </p>
            </>
          }
        />

        <Section
          title="2. Accès à l'intranet :"
          content={
            <p>
              L&apos;accès à l&apos;intranet est réservé aux collaborateurs de l&apos;entreprise, disposant d&apos;un identifiant et d&apos;un mot de passe personnels fournis par l&apos;administrateur système. L&apos;utilisateur s&apos;engage à conserver ces informations confidentielles et à ne pas les communiquer à des tiers.
            </p>
          }
        />

        <Section
          title="3. Utilisation autorisée :"
          content={
            <>
              <p>L&apos;intranet est un outil professionnel destiné à :</p>
              <ul className="list-disc list-inside mt-2 mb-2">
                <li>La communication interne de l&apos;entreprise, incluant le partage d&apos;informations et de documents ;</li>
                <li>La gestion des ressources internes, telles que les ressources humaines, les congés et la paie ;</li>
                <li>Le suivi des projets et des activités de l&apos;entreprise.</li>
              </ul>
              <p className="font-bold mt-4">Nota Bene : Toute utilisation à des fins personnelles, commerciales, politiques ou contraires aux lois en vigueur est strictement interdite.</p>
            </>
          }
        />

        <Section
          title="4. Responsabilités de l'utilisateur :"
          content={
            <>
              <p>L&apos;utilisateur s&apos;engage à :</p>
              <ul className="list-disc list-inside mt-2">
                <li>Respecter les règles de bonne conduite et de confidentialité ;</li>
                <li>Ne pas diffuser de contenus illicites, diffamatoires, discriminatoires ou injurieux ;</li>
                <li>Ne pas porter atteinte au bon fonctionnement de l&apos;intranet (tentatives de piratage, introduction de virus, surcharge du serveur, etc.) ;</li>
                <li>Signaler immédiatement toute anomalie ou accès frauduleux à l&apos;administrateur.</li>
              </ul>
            </>
          }
        />

        <Section
          title="5. Propriété intellectuelle :"
          content={
            <p>
              Tous les contenus présents sur l&apos;intranet (textes, logos, documents, logiciels, etc.) sont la propriété exclusive de l&apos;entreprise ou de ses partenaires. Toute reproduction, modification ou diffusion sans autorisation est interdite.
            </p>
          }
        />

        <Section
          title="6. Données personnelles :"
          content={
            <p>
              Dans le cadre de l&apos;utilisation de l&apos;intranet, des données personnelles peuvent être collectées (nom, email, fiche de paie, etc.). Ces données sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). L&apos;utilisateur dispose d&apos;un droit d&apos;accès, de rectification et de suppression de ses données, à exercer auprès du service RH.
            </p>
          }
        />

        <Section
          title="7. Sécurité :"
          content={
            <p>
              L&apos;intranet est sécurisé par des mesures techniques (authentification, cryptage, journalisation des connexions, etc.) visant à protéger les données et l&apos;accès au système. L&apos;utilisateur s&apos;engage à respecter ces mesures et à ne pas les contourner.
            </p>
          }
        />

        <Section
          title="8. Suspension et suppression de compte :"
          content={
            <p>
              L&apos;Entreprise se réserve le droit de suspendre ou supprimer l&apos;accès à l&apos;intranet à tout utilisateur ne respectant pas les présentes CGU, ou lors du départ de l&apos;entreprise.
            </p>
          }
        />

        <Section
          title="9. Évolutions des CGU :"
          content={
            <p>
              L&apos;Entreprise peut modifier à tout moment les présentes CGU. Les utilisateurs seront informés des modifications majeures par notification via l&apos;intranet, via Teams ou par email professionnel.
            </p>
          }
        />

        <footer className="border-t mt-10 pt-6 text-center text-gray-500 text-sm">
          &copy; EXTEDIM MADAGASCAR - Conditions Générales d&apos;Utilisation
        </footer>
      </div>
    </div>
  );
}

function Section({ title, content }) {
  return (
    <div className="mb-6">
      <h2 className="font-bold text-gray-700 mb-2">{title}</h2>
      <div className="text-justify text-gray-800 space-y-2">{content}</div>
    </div>
  );
}
