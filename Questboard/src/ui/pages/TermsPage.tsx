// import { LegalPage } from './LegalPage';

// type Props = {
//   onBack: () => void;
// };

// export const TermsPage = ({ onBack }: Props) => {
//   return (
//     <LegalPage title="Terms of Service" onBack={onBack}>

//       <h2>1. Acceptance</h2>

//       <p>
//         By creating an account or using RuneRush you agree to these Terms.
//       </p>

//       <h2>2. Eligibility</h2>

//       <ul>
//         <li>Be at least 13 years old.</li>
//         <li>Comply with applicable laws.</li>
//         <li>Comply with game publisher rules.</li>
//       </ul>

//       <h2>3. Services</h2>

//       <ul>
//         <li>Game tracking</li>
//         <li>Challenges</li>
//         <li>Marketplace</li>
//         <li>Virtual Coins</li>
//         <li>Streamer Mode</li>
//       </ul>

//       <h2>4. Virtual Coins</h2>

//       <p>
//         Coins have no cash value unless explicitly redeemed through RuneRush.
//       </p>

//       <h2>5. Marketplace</h2>

//       <p>
//         Marketplace rewards are subject to availability and may change without
//         notice.
//       </p>

//       <h2>6. Streamer Mode</h2>

//       <p>
//         Streamers may create challenges after reserving the reward balance in
//         their RuneRush wallet.
//       </p>

//       <h2>7. Reserved Reward Balance</h2>

//       <p>
//         Rewards are locked until the challenge completes, expires or is
//         cancelled.
//       </p>

//       <h2>8. Cash Rewards</h2>

//       <p>
//         Cash rewards may require identity verification and fraud review.
//       </p>

//       <h2>9. Fraud</h2>

//       <p>
//         Bots, cheats, account farming, fake gameplay or exploiting the platform
//         may result in permanent suspension.
//       </p>

//       <h2>10. Intellectual Property</h2>

//       <p>
//         RuneRush owns all software, branding and marketplace assets.
//       </p>

//       <h2>11. Disclaimer</h2>

//       <p>
//         RuneRush is provided "AS IS" without warranties of uninterrupted
//         service.
//       </p>

//       <h2>12. Limitation of Liability</h2>

//       <p>
//         RuneRush is not liable for indirect damages, data loss or unavailable
//         rewards.
//       </p>

//       <h2>13. Contact</h2>

//       <p>support@runerush.gg</p>

//     </LegalPage>
//   );
// };

import { LegalPage } from './LegalPage';
import { LegalSection } from './LegalSection';

type Props = {
  onBack: () => void;
};

export const TermsPage = ({ onBack }: Props) => {
  return (
    <LegalPage title="Terms of Service" onBack={onBack}>
      <LegalSection number={1} title="Acceptance">
        <p>
          By creating an account or using RuneRush you agree to these Terms of
          Service.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Eligibility">
        <ul className="list-disc space-y-2 pl-6 marker:text-sky-400">
          <li>Be at least 13 years old.</li>
          <li>Comply with applicable laws.</li>
          <li>Follow publisher and Overwolf rules.</li>
        </ul>
      </LegalSection>

      <LegalSection number={3} title="Services">
        <ul className="grid gap-3 md:grid-cols-2">
          <li className="rounded-xl bg-slate-800 p-3">🎮 Game Tracking</li>
          <li className="rounded-xl bg-slate-800 p-3">🏆 Challenges</li>
          <li className="rounded-xl bg-slate-800 p-3">🛒 Marketplace</li>
          <li className="rounded-xl bg-slate-800 p-3">🪙 Virtual Coins</li>
          <li className="rounded-xl bg-slate-800 p-3">📺 Streamer Mode</li>
        </ul>
      </LegalSection>

      <LegalSection number={4} title="Virtual Coins">
        <p>
          Coins have no monetary value unless explicitly redeemed through
          RuneRush.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Marketplace">
        <p>
          Marketplace rewards may change or become unavailable without prior
          notice.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Streamer Mode">
        <p>
          Streamers must reserve the full reward amount before publishing a
          challenge.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Reserved Reward Balance">
        <p>
          Reserved balances remain locked until challenges end, expire or are
          cancelled.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Cash Rewards">
        <p>Identity verification may be required before cash payouts.</p>
      </LegalSection>

      <LegalSection number={9} title="Fraud & Abuse">
        <p>
          Cheating, exploiting, automation, bots or account farming may result
          in permanent suspension and forfeiture of rewards.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Intellectual Property">
        <p>
          RuneRush retains ownership of all software, branding and marketplace
          assets.
        </p>
      </LegalSection>

      <LegalSection number={11} title="Disclaimer">
        <p>
          RuneRush is provided on an "AS IS" basis without guarantees of
          uninterrupted service.
        </p>
      </LegalSection>

      <LegalSection number={12} title="Limitation of Liability">
        <p>
          RuneRush shall not be liable for indirect damages, loss of rewards or
          data arising from use of the service.
        </p>
      </LegalSection>

      <LegalSection number={13} title="Contact">
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
          <span className="font-semibold text-white">Email</span>
          <p className="mt-1 text-sky-300">questboard26@gmail.com</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
};
