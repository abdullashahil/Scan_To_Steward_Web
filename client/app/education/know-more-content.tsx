export default function KnowMoreContent() {
  return (
    <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
      <div>
        <h3 className="font-semibold text-foreground">🦠 Infections</h3>
        <p>
          Infections happen when germs like bacteria or viruses enter the body and multiply.
          Common symptoms include fever, swelling, cough, and fatigue.
          Good hygiene and vaccines help prevent infections.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">💊 What are Antibiotics?</h3>
        <p>
          Antibiotics are medicines that treat bacterial infections by killing or stopping bacteria.
          They do not work for viral illnesses like cold, flu, or COVID-19.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">⚠️ Misuse of Antibiotics</h3>
        <p>
          Taking antibiotics unnecessarily, skipping doses, or stopping early can reduce their effectiveness
          and lead to resistance.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">🧬 Antibiotic Resistance (AMR)</h3>
        <p>
          Antibiotic resistance occurs when bacteria become strong enough to survive medicines.
          This makes infections harder to treat and can spread to others.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">✅ Proper Use</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Take only when prescribed</li>
          <li>Follow correct dose and timing</li>
          <li>Complete the full course</li>
          <li>Do not share or reuse antibiotics</li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">⏰ Medication Adherence</h3>
        <p>
          Take medicines on time for best results. Use reminders like alarms or pill organizers
          to avoid missing doses.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">⚕️ Side Effects & Safety</h3>
        <p>
          Common side effects include nausea, diarrhea, or mild rashes.
          Seek medical help if you experience severe reactions or allergies.
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-foreground">🧪 Bacterial vs Viral</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Bacterial:</strong> Treated with antibiotics (e.g., strep throat)</li>
          <li><strong>Viral:</strong> Not treated with antibiotics (e.g., cold, flu)</li>
        </ul>
      </div>
    </div>
  )
}
