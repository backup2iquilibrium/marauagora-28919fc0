import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone } from "lucide-react";

interface AdSlotProps {
  slug: string;
  className?: string;
  label?: string;
}

export function AdSlot({ slug, className = "", label }: AdSlotProps) {
  const { data: campaign, isLoading } = useQuery({
    queryKey: ["ad-campaign", slug],
    queryFn: async () => {
      // First find the space ID for this slug
      const { data: space, error: spaceError } = await supabase
        .from("ad_spaces")
        .select("id, name")
        .eq("slug", slug)
        .maybeSingle();

      if (spaceError || !space) return null;

      // Then find an active campaign for this space
      const { data: campaigns, error: campaignError } = await supabase
        .from("ad_campaigns")
        .select("*")
        .eq("space_id", space.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      if (campaignError || !campaigns || campaigns.length === 0) {
        return { spaceName: space.name, empty: true };
      }

      return { ...campaigns[0], spaceName: space.name, empty: false };
    },
  });

  if (isLoading) {
    return <Skeleton className={`w-full h-32 rounded-lg ${className}`} />;
  }

  // If no space or no active campaign, show a friendly placeholder
  if (!campaign || (campaign as any).empty) {
    const spaceName = (campaign as any)?.spaceName || label || slug;
    return (
      <div className={`w-full min-h-[120px] bg-muted/30 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 text-center group hover:bg-muted/50 transition-colors cursor-pointer ${className}`}>
        <Megaphone className="h-6 w-6 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
        <span className="text-muted-foreground font-bold tracking-tight text-sm uppercase mb-1">
          {spaceName}
        </span>
        <span className="text-[10px] text-muted-foreground/60">Espaço disponível para anúncio</span>
        <div className="absolute top-2 right-2 text-[8px] text-muted-foreground/40 font-mono">
          ID: {slug}
        </div>
      </div>
    );
  }

  // If we have a campaign, render it
  // Since we don't have an image_url yet in the schema (I check later), 
  // let's assume notes might contain info or just show the title for now.
  // Wait, I should check if I missed an image_url field.
  return (
    <div className={`w-full rounded-lg overflow-hidden border shadow-sm ${className}`}>
      <div className="bg-card p-4 space-y-2 relative">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Publicidade</span>
          <div className="text-[8px] text-muted-foreground font-mono">
            REF: {slug}
          </div>
        </div>
        <div className="font-bold text-lg">{campaign.title}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">{campaign.notes}</div>
        {/* Placeholder for future image implementation */}
        <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
          <span className="text-xs text-muted-foreground italic">Banner do Cliente: {campaign.client_name}</span>
        </div>
      </div>
    </div>
  );
}
