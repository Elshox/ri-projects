'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { ProjectCard } from '@/components/ui/project-card';
import type { ProjectData, ProjectSector } from '@/lib/data/projects';
import { X } from 'lucide-react';

type Labels = {
  filterAll: string;
  filterSector: string;
  filterYear: string;
  filterCity: string;
  filterReset: string;
  viewProject: string;
  noResults: string;
};

type Props = {
  locale: string;
  projects: readonly ProjectData[];
  sectors: ProjectSector[];
  years: number[];
  cities: string[];
  labels: Labels;
};

export function ProjectsGrid({ locale, projects, sectors, years, cities, labels }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const activeSector = searchParams.get('sector') ?? '';
  const activeYear = searchParams.get('year') ? Number(searchParams.get('year')) : 0;
  const activeCity = searchParams.get('city') ?? '';

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function resetFilters() {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  }

  const hasFilters = Boolean(activeSector || activeYear || activeCity);

  const filtered = projects.filter((p) => {
    if (activeSector && p.sector !== activeSector) return false;
    if (activeYear && p.year !== activeYear) return false;
    if (activeCity && p.city !== activeCity) return false;
    return true;
  });

  return (
    <>
      {/* Filters */}
      <div className="mb-10 flex flex-wrap items-center gap-4">
        {/* Sector */}
        <FilterSelect
          label={labels.filterSector}
          value={activeSector}
          options={sectors.map((s) => ({ value: s, label: s }))}
          allLabel={labels.filterAll}
          onChange={(v) => setFilter('sector', v)}
        />

        {/* Year */}
        <FilterSelect
          label={labels.filterYear}
          value={activeYear ? String(activeYear) : ''}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
          allLabel={labels.filterAll}
          onChange={(v) => setFilter('year', v)}
        />

        {/* City */}
        <FilterSelect
          label={labels.filterCity}
          value={activeCity}
          options={cities.map((c) => ({ value: c, label: c }))}
          allLabel={labels.filterAll}
          onChange={(v) => setFilter('city', v)}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-sans text-sm text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            {labels.filterReset}
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center font-sans text-muted">{labels.noResults}</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              viewLabel={labels.viewProject}
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </>
  );
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  allLabel: string;
  onChange: (v: string) => void;
};

function FilterSelect({ label, value, options, allLabel, onChange }: FilterSelectProps) {
  return (
    <label className="relative flex items-center gap-2 font-sans text-sm">
      <span className="text-muted">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer rounded-full border border-border bg-white py-2 pl-3 pr-8 text-sm text-primary shadow-sm transition-colors hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
