import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Code2, MonitorPlay, Mail, Moon, Sun, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from 'next-themes';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { setTheme } = useTheme();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <p className="fixed bottom-4 left-4 text-sm text-muted-foreground hidden md:flex items-center gap-1 z-40 bg-background/50 backdrop-blur px-3 py-1.5 rounded-full border border-border">
        Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"><span className="text-xs">⌘</span>K</kbd> to open menu
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={language === 'vi' ? "Nhập lệnh tìm kiếm..." : "Type a command or search..."} />
        <CommandList>
          <CommandEmpty>{language === 'vi' ? 'Không tìm thấy kết quả.' : 'No results found.'}</CommandEmpty>
          <CommandGroup heading={language === 'vi' ? "Điều hướng" : "Navigation"}>
            <CommandItem onSelect={() => runCommand(() => document.getElementById('dev')?.scrollIntoView())}>
              <Code2 className="mr-2 h-4 w-4" />
              <span>{language === 'vi' ? 'Dự án (Dev)' : 'Projects (Dev)'}</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => document.getElementById('media')?.scrollIntoView())}>
              <MonitorPlay className="mr-2 h-4 w-4" />
              <span>Truyền thông (Media)</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => document.getElementById('contact')?.scrollIntoView())}>
              <Mail className="mr-2 h-4 w-4" />
              <span>{language === 'vi' ? 'Liên hệ' : 'Contact'}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={language === 'vi' ? "Cài đặt" : "Settings"}>
            <CommandItem onSelect={() => runCommand(() => setLanguage(language === 'vi' ? 'en' : 'vi'))}>
              <Languages className="mr-2 h-4 w-4" />
              <span>{language === 'vi' ? 'Đổi sang Tiếng Anh' : 'Switch to Vietnamese'}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default CommandMenu;
