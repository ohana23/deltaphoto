import { Deltaphoto } from "../packages/deltaphoto/src";

export default function Home() {
  return (
    <main>
      <Deltaphoto
        className="example-component"
        before="/demo/before.png"
        after="/demo/after.png"
        beforeAlt="Apartment living room before renovation"
        afterAlt="Apartment living room after renovation"
        ariaLabel="Compare the apartment before and after renovation"
      />
    </main>
  );
}
