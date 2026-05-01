import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ProjectData } from '@/lib/data/projects';

const BLUR =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=';

type ProjectCardProps = {
  project: ProjectData;
  locale: string;
  viewLabel: string;
  priority?: boolean;
};

export function ProjectCard({ project, locale, viewLabel, priority = false }: ProjectCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`${viewLabel}: ${project.slug}`}
      />
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.client}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
          placeholder="blur"
          blurDataURL={BLUR}
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/80">
          <span>{project.city}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{project.area.toLocaleString()} м²</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-widest text-accent">
          {project.sector}
        </p>
        <h3 className="font-sans text-base font-semibold text-primary">{project.client}</h3>
        <div className="mt-auto flex items-center gap-1 pt-4 font-sans text-sm font-medium text-accent">
          {viewLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden />
        </div>
      </div>
    </article>
  );
}
