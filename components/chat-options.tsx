"use client";
import React, { useMemo, FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Type, Image, AudioWaveform, Video, Brush, Search, Code, Globe, Smartphone, Laptop,
  Terminal, LucideProps, Wand, Crop, Music, MicVocal, GalleryVerticalEnd, Sparkles,
  Gem, AudioLines, Webcam, Blocks, Chrome, Podcast, BoomBox, Speaker, Hourglass,
  Microscope, TrainFront, FastForward, ClockFading, Clapperboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFridayChatStore } from '@/trash/friday-chat-store';

interface CategoryItem {
  label: string;
  icon: React.ComponentType<LucideProps>;
}

interface ChildSubcategoryItem extends CategoryItem {
  id: string;
}

const mediaCategories: Record<string, CategoryItem> = {
  text: { label: 'Text', icon: Type },
  image: { label: 'Image', icon: Image },
  audio: { label: 'Audio', icon: AudioWaveform },
  video: { label: 'Video', icon: Video },
};

const parentSubcategories: Record<string, CategoryItem> = {
  'text-default': { label: 'Default', icon: Sparkles },
  canvas: { label: 'Canvas', icon: Brush },
  search: { label: 'Search', icon: Search },
  'deep-research': { label: 'Deep Research', icon: Microscope },
  code: { label: 'Code', icon: Code },
  'image-fast': { label: 'Image Fast', icon: ClockFading },
  'image-quality': { label: 'Image Quality', icon: Gem },
  'video-fast': { label: 'Video Fast', icon: FastForward },
  'video-quality': { label: 'Video Quality', icon: Clapperboard },
  translation: { label: 'Translation', icon: AudioLines },
  music: { label: 'Music', icon: Music },
};

const childSubcategories: Record<string, ChildSubcategoryItem[]> = {
  'text-default': [
    { id: 'fast', label: 'Fast', icon: TrainFront },
    { id: 'think', label: 'Think', icon: Hourglass },
  ],
  code: [
    { id: 'web', label: 'Web', icon: Globe },
    { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
    { id: 'desktop', label: 'Desktop Apps', icon: Laptop },
    { id: 'pwa', label: 'Progressive Web Apps', icon: Webcam },
    { id: 'browser-extension', label: 'Browser Extension', icon: Chrome },
    { id: 'other-extension', label: 'Other Extension', icon: Blocks },
    { id: 'cli', label: 'CLI/Terminal Apps', icon: Terminal },
  ],
  'image-fast': [
    { id: '1:1', label: '1:1', icon: Crop },
    { id: '9:16', label: '9:16', icon: Crop },
    { id: '16:9', label: '16:9', icon: Crop },
    { id: '3:4', label: '3:4', icon: Crop },
    { id: '4:3', label: '4:3', icon: Crop },
  ],
  'image-quality': [
    { id: '1:1', label: '1:1', icon: Crop },
    { id: '9:16', label: '9:16', icon: Crop },
    { id: '16:9', label: '16:9', icon: Crop },
    { id: '3:4', label: '3:4', icon: Crop },
    { id: '4:3', label: '4:3', icon: Crop },
  ],
  'video-fast': [
    { id: '9:16-8s', label: '9:16 (8s)', icon: Crop },
    { id: '16:9-8s', label: '16:9 (8s)', icon: Crop },
  ],
  'video-quality': [
    { id: '9:16-30s', label: '9:16 (30s)', icon: Crop },
    { id: '16:9-30s', label: '16:9 (30s)', icon: Crop },
  ],
  translation: [
    { id: 'tts', label: 'TTS', icon: GalleryVerticalEnd },
    { id: 'podcast', label: 'Podcast', icon: Podcast },
  ],
  music: [
    { id: 'background', label: 'Background', icon: BoomBox },
    { id: 'sfx', label: 'Sound Effect', icon: Speaker },
    { id: 'voiceover', label: 'Voiceover', icon: MicVocal },
  ],
};

type MediaCategoryKey = keyof typeof mediaCategories;
type ParentSubcategoryKey = keyof typeof parentSubcategories;
type ChildSubcategoryKey = string;

const VerticalSeparator: FC = () => <div className="h-4 w-px bg-border mx-1" />;

const getDefaultParent = (mediaKey: MediaCategoryKey): ParentSubcategoryKey => {
  switch (mediaKey) {
    case 'text': return 'text-default';
    case 'image': return 'image-fast';
    case 'video': return 'video-fast';
    case 'audio': return 'music';
    default: return 'text-default';
  }
};

const getDefaultChild = (parentKey: ParentSubcategoryKey): ChildSubcategoryKey | null => {
  return childSubcategories[parentKey]?.[0]?.id || null;
};

export const ChatOptions: FC = () => {
  const { mediaCategory, parentSubCategory, childSubCategory, setCategories } = useFridayChatStore();

  const parentOptions = useMemo((): ParentSubcategoryKey[] => {
    const common: ParentSubcategoryKey[] = ['canvas', 'search', 'deep-research'];
    switch (mediaCategory) {
      case 'text': return ['text-default', 'code', ...common];
      case 'image': return ['image-fast', 'image-quality', ...common];
      case 'video': return ['video-fast', 'video-quality', ...common];
      case 'audio': return ['translation', 'music', ...common];
      default: return common;
    }
  }, [mediaCategory]);

  const childOptions = useMemo((): ChildSubcategoryItem[] => {
    return childSubcategories[parentSubCategory] || [];
  }, [parentSubCategory]);

  const handleMediaSelect = (newMedia: any) => {
    const newParent = getDefaultParent(newMedia);
    const newChild = getDefaultChild(newParent);
    setCategories({ media: newMedia, parent: newParent, child: newChild });
  };

  const handleParentSelect = (newParent: ParentSubcategoryKey) => {
    const newChild = getDefaultChild(newParent);
    setCategories({ media: mediaCategory, parent: newParent, child: newChild });
  };

  const handleChildSelect = (newChild: ChildSubcategoryKey) => {
    setCategories({ media: mediaCategory, parent: parentSubCategory, child: newChild });
  };

  const getTriggerDisplay = (type: 'media' | 'parent' | 'child', selectedKey: string | null) => {
    let data: CategoryItem | undefined;
    if (type === 'child') {
      const childData = selectedKey ? childOptions.find(c => c.id === selectedKey) : undefined;
      const Icon = childData?.icon || Wand;
      const label = childData?.label || "Default";
      const showIcon = mediaCategory === 'text';
      return (
        <div className="flex items-center justify-center w-full">
          {showIcon && Icon && <Icon className="size-3.5 text-muted-foreground group-hover:text-primary" />}
          {!showIcon && <span className="truncate w-min md:w-auto">{label}</span>}
        </div>
      );
    }
    if (type === 'media') {
      data = selectedKey ? mediaCategories[selectedKey as MediaCategoryKey] : undefined;
    } else {
      data = selectedKey ? parentSubcategories[selectedKey as ParentSubcategoryKey] : undefined;
    }
    const Icon = data?.icon;
    return (
      <div className="flex items-center">
        {Icon ? <Icon className="size-3.5 text-muted-foreground group-hover:text-primary" /> : "Select"}
      </div>
    );
  };

  return (
    <div className="flex items-center h-9 rounded-md border bg-card text-card-foreground p-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="group flex bg-primary-foreground rounded-md border justify-center text-muted hover:text-primary size-6.5 hover:bg-secondary">
            {getTriggerDisplay('media', mediaCategory)}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto">
          {Object.keys(mediaCategories).map((key) => {
            const { label, icon: Icon } = mediaCategories[key as MediaCategoryKey];
            return (
              <DropdownMenuItem key={key} onSelect={() => handleMediaSelect(key as MediaCategoryKey)}>
                <Icon className="mr-2 size-3.5" />
                <span className="text-xs">{label}</span>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <VerticalSeparator />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="group flex bg-primary-foreground rounded-md border justify-center text-muted hover:text-primary size-6.5 hover:bg-secondary px-1.5" disabled={parentOptions.length === 0}>
            {getTriggerDisplay('parent', parentSubCategory)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto">
          {parentOptions.map((key) => {
            const parentData = parentSubcategories[key];
            if (!parentData) return null;
            const { label, icon: Icon } = parentData;
            return (
              <DropdownMenuItem key={key} onSelect={() => handleParentSelect(key)}>
                <Icon className="mr-2 size-3.5" />
                <span className="text-xs">{label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <VerticalSeparator />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="group flex bg-primary-foreground rounded-md border justify-center text-primary h-6.5 min-w-6.5 hover:bg-secondary text-xs px-1.5" disabled={childOptions.length === 0}>
            {getTriggerDisplay('child', childSubCategory)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-auto">
          {childOptions.map(({ id, label, icon: Icon }) => (
            <DropdownMenuItem key={id} onSelect={() => handleChildSelect(id)}>
              <Icon className="mr-2 size-3.5" />
              <span className="text-xs">{label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
