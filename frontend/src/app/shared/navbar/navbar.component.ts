import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('userDropdown') userDropdown!: ElementRef<HTMLDivElement>;

  isLoggedIn = false; // This should be connected to your auth service
  isMobileMenuOpen = false;
  isUserDropdownOpen = false;
  searchControl = new FormControl('');
  searchQuery = '';
  currentRoute = '';

  // Mock user data - replace with actual user service
  currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12'
  };

  menuItems = [
    { label: 'Home', route: '/', icon: '🏠' },
    { label: 'About', route: '/about', icon: 'ℹ️' },
    { label: 'Services', route: '/services', icon: '⚙️' },
    { label: 'Contact', route: '/contact', icon: '📧' }
  ];

  constructor(
    public router: Router,
    private elementRef: ElementRef,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Initialize current route
    this.currentRoute = this.router.url;
    
    // Subscribe to route changes to update active state
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });

    // Theme is handled by ThemeService (applied globally via body.dark-theme)

    // Setup search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.searchQuery = query || '';
        // Emit search event or navigate to search results
        if (this.searchQuery.length > 0) {
          // this.performSearch(this.searchQuery);
        }
      });
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event): void {
    if (this.userDropdown && !this.userDropdown.nativeElement.contains(event.target as Node)) {
      this.isUserDropdownOpen = false;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMobileMenuOpen = false;
  }


  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/courses'], { queryParams: { search: this.searchQuery } });
      this.isMobileMenuOpen = false;
    }
  }

  onProfileClick(): void {
    this.router.navigate(['/profile']);
    this.isUserDropdownOpen = false;
  }

  onMyCoursesClick(): void {
    this.router.navigate(['/my-courses']);
    this.isUserDropdownOpen = false;
  }

  onLogout(): void {
    // Implement logout logic
    this.isLoggedIn = false;
    this.isUserDropdownOpen = false;
    this.router.navigate(['/home']);
  }

  // Mock login - replace with actual auth service
  mockLogin(): void {
    this.isLoggedIn = true;
  }

  
}
