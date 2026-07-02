// import { LegalPage } from './LegalPage';
// import { LegalSection } from './LegalSection';

// <LegalPage title="Privacy Policy" onBack={onBack}>

// <LegalSection number={1} title="Introduction">
//   <p>
//     RuneRush respects your privacy. This Privacy Policy explains how we collect,
//     use, store and protect your information while using the RuneRush Overwolf
//     application.
//   </p>
// </LegalSection>

// <LegalSection number={2} title="Information We Collect">

//   <ul className="list-disc space-y-2 pl-6 marker:text-sky-400">
//     <li>Username</li>
//     <li>Email Address</li>
//     <li>Authentication Provider</li>
//     <li>Supported Games Played</li>
//     <li>Play Sessions</li>
//     <li>Challenge Completion</li>
//     <li>Wallet Balances</li>
//     <li>Reserved Reward Balances</li>
//     <li>Marketplace Activity</li>
//     <li>Streamer Challenges</li>
//     <li>Device Information</li>
//     <li>Crash Logs</li>
//   </ul>

// </LegalSection>

// <LegalSection number={3} title="Gameplay Tracking">
//   <p>
//     RuneRush uses Overwolf game events to verify challenge completion. Tracking
//     depends on supported games and available game events.
//   </p>
// </LegalSection>

// <LegalSection number={4} title="Wallet Information">
//   <p>
//     We store wallet balances, transaction history, marketplace purchases,
//     reserved rewards and reward redemption history.
//   </p>
// </LegalSection>

// <LegalSection number={5} title="Streamer Mode">
//   <p>
//     Streamers may create challenges and assign rewards. We collect challenge
//     metadata, participant information and completion statistics.
//   </p>
// </LegalSection>

// <LegalSection number={6} title="Payment Information">
//   <p>
//     Payments are securely processed by trusted providers. RuneRush does not
//     store complete payment card information.
//   </p>
// </LegalSection>

// <LegalSection number={7} title="Fraud Detection">
//   <p>
//     We automatically monitor gameplay and wallet activity to detect bots,
//     cheating, exploitation and fraudulent reward claims.
//   </p>
// </LegalSection>

// <LegalSection number={8} title="Information Sharing">
//   <p>
//     We only share information with Overwolf, payment providers, cloud
//     infrastructure, analytics providers or legal authorities when required.
//   </p>
// </LegalSection>

// <LegalSection number={9} title="Data Security">
//   <p>
//     Industry-standard safeguards are used to protect your personal information.
//   </p>
// </LegalSection>

// <LegalSection number={10} title="Your Rights">
//   <p>
//     Depending on your jurisdiction you may request access, correction, deletion
//     or export of your personal data.
//   </p>
// </LegalSection>

// <LegalSection number={11} title="Contact">
//   <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
//     <span className="font-semibold text-white">Email</span>
//     <p className="mt-1 text-sky-300">
//       support@runerush.gg
//     </p>
//   </div>
// </LegalSection>

// </LegalPage>

import { LegalPage } from './LegalPage';
import { LegalSection } from './LegalSection';

type Props = {
  onBack: () => void;
};

export const PrivacyPage = ({ onBack }: Props) => {
  return (
    <LegalPage title="Privacy Policy" onBack={onBack}>
      <LegalSection number={1} title="Introduction">
        <p>
          RuneRush respects your privacy. This Privacy Policy explains how we
          collect, use, store and protect your information while using the
          RuneRush Overwolf application.
        </p>
      </LegalSection>

      <LegalSection number={2} title="Information We Collect">
        <ul className="list-disc space-y-2 pl-6 marker:text-sky-400">
          <li>Username</li>
          <li>Email Address</li>
          <li>Authentication Provider</li>
          <li>Supported Games Played</li>
          <li>Play Sessions</li>
          <li>Challenge Completion</li>
          <li>Wallet Balances</li>
          <li>Reserved Reward Balances</li>
          <li>Marketplace Activity</li>
          <li>Streamer Challenges</li>
          <li>Device Information</li>
          <li>Crash Logs</li>
        </ul>
      </LegalSection>

      <LegalSection number={3} title="Gameplay Tracking">
        <p>
          RuneRush uses Overwolf game events to verify challenge completion.
          Tracking depends on supported games and available game events.
        </p>
      </LegalSection>

      <LegalSection number={4} title="Wallet Information">
        <p>
          We store wallet balances, transaction history, marketplace purchases,
          reserved rewards and reward redemption history.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Streamer Mode">
        <p>
          Streamers may create challenges and assign rewards. We collect
          challenge metadata, participant information and completion statistics.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Payment Information">
        <p>
          Payments are securely processed by trusted providers. RuneRush does
          not store complete payment card information.
        </p>
      </LegalSection>

      <LegalSection number={7} title="Fraud Detection">
        <p>
          We automatically monitor gameplay and wallet activity to detect bots,
          cheating, exploitation and fraudulent reward claims.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Information Sharing">
        <p>
          We only share information with Overwolf, payment providers, cloud
          infrastructure, analytics providers or legal authorities when
          required.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Data Security">
        <p>
          Industry-standard safeguards are used to protect your personal
          information.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Your Rights">
        <p>
          Depending on your jurisdiction you may request access, correction,
          deletion or export of your personal data.
        </p>
      </LegalSection>

      <LegalSection number={11} title="Contact">
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
          <span className="font-semibold text-white">Email</span>
          <p className="mt-1 text-sky-300">questboard26@gmail.com</p>
        </div>
      </LegalSection>
    </LegalPage>
  );
};
