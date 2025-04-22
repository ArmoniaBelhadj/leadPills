import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

interface TopbarProps {
  selectedSource: string;
  onSourceChange: (source: string) => void;
}

export default function Topbar({ selectedSource, onSourceChange }: TopbarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const sources = ["Mubawab", "Facebook", "LinkedIn", "Website", "All Sources"];

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <span className="text-neutral-600 font-medium mr-3">Currently managing</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-36 justify-between">
                {selectedSource}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sources.map((source) => (
                <DropdownMenuItem 
                  key={source}
                  onClick={() => onSourceChange(source)}
                >
                  {source}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <span className="text-neutral-700 font-medium">Mehdi</span>
              <ChevronDown className="h-4 w-4 text-neutral-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Your Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
