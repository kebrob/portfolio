import { IMPRINT } from "@/lib/site";

export default function LegalAddress() {
    return (
        <address className="not-italic">
            {IMPRINT.name}
            <br />
            {IMPRINT.street}
            <br />
            {IMPRINT.postalCode} {IMPRINT.city}
            <br />
            {IMPRINT.country}
        </address>
    );
}
