import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { LeadStatus, LeadSource } from "@prisma/client";
import LeadStatusButton from "./_components/LeadStatusButton";

export const metadata: Metadata = { title: "Leads — Admin" };

async function getLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: { select: { title: true, slug: true } } },
  });
}

const statusColors: Record<LeadStatus, string> = {
  New: "text-gold bg-gold/10",
  Read: "text-emerald-400 bg-emerald-400/10",
  Archived: "text-brand-muted bg-brand-muted/10",
};

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  const byStatus = {
    New: leads.filter((l) => l.status === LeadStatus.New).length,
    Read: leads.filter((l) => l.status === LeadStatus.Read).length,
    Archived: leads.filter((l) => l.status === LeadStatus.Archived).length,
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <div className="flex items-center gap-4 mb-2">
          <span className="h-px w-8 bg-gold/40" />
          <p className="font-body text-[10px] font-medium tracking-[0.35em] text-gold uppercase">
            Enquiries
          </p>
        </div>
        <h1 className="font-heading font-light text-brand-text text-4xl">Leads</h1>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        {(["New", "Read", "Archived"] as LeadStatus[]).map((s) => (
          <div key={s} className="border border-gold/15 bg-brand-surface px-5 py-3 flex items-center gap-3">
            <span className={`font-body text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 ${statusColors[s]}`}>
              {s}
            </span>
            <span className="font-heading font-light text-brand-text text-2xl">{byStatus[s]}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      {leads.length === 0 ? (
        <p className="font-body text-sm text-brand-muted py-8">No leads yet.</p>
      ) : (
        <div className="border border-gold/15 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gold/15 bg-brand-surface/50">
                {["Name", "Contact", "Source", "Property", "Status", "Date", "Action"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-brand-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/8">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-brand-surface/40 transition-colors">
                  <td className="px-4 py-4 font-body text-sm text-brand-text whitespace-nowrap">
                    {lead.name}
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-0.5">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="block font-body text-xs text-brand-muted hover:text-gold transition-colors">
                          {lead.email}
                        </a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="block font-body text-xs text-brand-muted hover:text-gold transition-colors">
                          {lead.phone}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-body text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 ${
                      lead.source === LeadSource.Property ? "text-gold border border-gold/30" : "text-brand-muted border border-brand-muted/20"
                    }`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-body text-xs text-brand-muted max-w-[180px] truncate">
                    {lead.property?.title ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`font-body text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-body text-xs text-brand-muted whitespace-nowrap">
                    {lead.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-4">
                    <LeadStatusButton id={lead.id} current={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
