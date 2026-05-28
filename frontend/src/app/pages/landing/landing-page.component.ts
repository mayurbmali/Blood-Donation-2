import {
  Component, OnInit, OnDestroy, HostListener, AfterViewInit,
  ElementRef, ViewChildren, QueryList, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ThemeToggleComponent } from '../../shared/theme-toggle.component';

interface Stat { label: string; end: number; suffix: string; current: number; }
interface Feature { icon: string; title: string; desc: string; }
interface Step { icon: string; title: string; desc: string; }
interface Role { icon: string; name: string; color: string; items: string[]; cta: string; link: string; }
interface Testimonial { name: string; role: string; avatar: string; rating: number; quote: string; }
interface Faq { q: string; a: string; open: boolean; }

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule, RevealDirective, ThemeToggleComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, AfterViewInit, OnDestroy {

  navScrolled = false;
  mobileMenuOpen = false;
  activeTestimonial = 0;
  private carouselTimer: any;
  private statsObserver!: IntersectionObserver;
  statsAnimated = false;

  navLinks = ['Home', 'Features', 'How It Works', 'Roles', 'Contact'];

  stats: Stat[] = [
    { label: 'Donors Registered', end: 12400, suffix: '+', current: 0 },
    { label: 'Units Donated', end: 38900, suffix: '+', current: 0 },
    { label: 'Lives Saved', end: 9200, suffix: '+', current: 0 },
    { label: 'Hospitals Connected', end: 340, suffix: '+', current: 0 },
  ];

  features: Feature[] = [
    { icon: 'donor', title: 'Donor Management', desc: 'Register, verify, and track blood donors with full profiles and donation history.' },
    { icon: 'blood', title: 'Blood Availability', desc: "Real-time inventory across all blood groups so hospitals always know what's on hand." },
    { icon: 'request', title: 'Request Blood', desc: 'Submit emergency or scheduled requests that are matched instantly to available units.' },
    { icon: 'alert', title: 'Real-time Alerts', desc: 'Instant notifications for critical shortages, approvals, and donation milestones.' },
    { icon: 'chart', title: 'Reports & Analytics', desc: 'Rich dashboards and exportable reports for compliance, trends, and operations.' },
  ];

  steps: Step[] = [
    { icon: 'register', title: 'Register', desc: 'Sign up as a donor, hospital, or organization in under two minutes.' },
    { icon: 'donate', title: 'Donate or Request', desc: 'Log a donation or raise a blood request for any blood group.' },
    { icon: 'match', title: 'We Match', desc: 'LifeLink automatically matches donors to requests based on compatibility and proximity.' },
    { icon: 'save', title: 'Save Lives', desc: 'Blood reaches the right patient at the right time. Every drop counts.' },
  ];

  roles: Role[] = [
    {
      icon: 'donor-role', name: 'Donor', color: '#E11D2E',
      items: ['Build your donor profile', 'Log donation history', 'View donation eligibility', 'Receive smart reminders'],
      cta: 'Become a Donor', link: '/register'
    },
    {
      icon: 'admin-role', name: 'Admin', color: '#0F172A',
      items: ['Manage all donors & requests', 'Approve or reject requests', 'Monitor blood inventory', 'Access full analytics'],
      cta: 'Admin Portal', link: '/login'
    },
    {
      icon: 'hospital-role', name: 'Hospital', color: '#2563EB',
      items: ['Submit blood requests', 'Track request status', 'Receive instant alerts', 'View donation reports'],
      cta: 'Request Blood', link: '/register'
    },
  ];

  testimonials: Testimonial[] = [
    { name: 'Dr. Arjun Mehta', role: 'City Hospital', avatar: 'AM', rating: 5, quote: 'LifeLink has transformed how we source blood in emergencies. Response times dropped by 60% since we joined.' },
    { name: 'Priya Sharma', role: 'Regular Donor', avatar: 'PS', rating: 5, quote: "I love seeing my donation history and knowing exactly when I'm eligible to donate again. This app makes giving back easy." },
    { name: 'Rahul Verma', role: 'NGO Partner', avatar: 'RV', rating: 5, quote: 'The analytics and reporting features help us coordinate blood drives with real data. Incredible platform.' },
    { name: 'Dr. Neha Patel', role: 'Metro Blood Bank', avatar: 'NP', rating: 5, quote: 'Inventory management used to take hours. LifeLink automated it completely and the real-time alerts are lifesaving.' },
    { name: 'Karan Singh', role: 'Volunteer Donor', avatar: 'KS', rating: 5, quote: 'Simple, fast, and meaningful. I registered in 2 minutes and donated within a week. Highly recommended.' },
  ];

  faqs: Faq[] = [
    { q: 'Who is eligible to donate blood?', a: 'Generally, adults aged 18–65 in good health, weighing over 50 kg, with no recent illness or surgery. LifeLink profiles help track your eligibility automatically.', open: false },
    { q: 'How often can I donate blood?', a: 'Whole blood donations require a minimum 56-day (8-week) gap. LifeLink enforces this automatically and notifies you when you\'re eligible again.', open: false },
    { q: 'Is my personal data safe?', a: 'All data is encrypted at rest and in transit. We follow strict healthcare data privacy standards and never sell your data to third parties.', open: false },
    { q: 'How does emergency blood request matching work?', a: 'When an emergency request is raised, LifeLink instantly scans available inventory and eligible donors within range, then notifies both parties.', open: false },
    { q: 'Can hospitals integrate LifeLink with their existing systems?', a: 'Yes. LifeLink offers a REST API that hospitals and laboratories can integrate with their HIS/LIS systems for seamless data exchange.', open: false },
    { q: 'What blood groups does LifeLink support?', a: 'All 8 standard blood groups: A+, A−, B+, B−, AB+, AB−, O+, O−. Inventory, requests, and matching are all group-aware.', open: false },
  ];

  partners = [
    { name: 'Red Cross', abbr: 'RC' },
    { name: 'WHO', abbr: 'WHO' },
    { name: 'AABB', abbr: 'AABB' },
    { name: 'Blood Bank Intl.', abbr: 'BBI' },
    { name: 'HealthNet', abbr: 'HN' },
    { name: 'MediCare', abbr: 'MC' },
  ];

  trustItems = [
    { icon: 'verified_user', title: 'Verified Profiles', desc: 'All donors verified by certified admins' },
    { icon: 'lock', title: 'End-to-End Encrypted', desc: 'Your data is always protected' },
    { icon: 'admin_panel_settings', title: 'Role-Based Access', desc: 'Granular control for every user type' },
    { icon: 'receipt_long', title: 'Audit-Ready Reports', desc: 'Full traceability & compliance logs' },
  ];

  ngOnInit(): void {
    this.startCarousel();
  }

  ngAfterViewInit(): void {
    this.initStatsObserver();
  }

  ngOnDestroy(): void {
    clearInterval(this.carouselTimer);
    this.statsObserver?.disconnect();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.navScrolled = window.scrollY > 40;
  }

  scrollTo(id: string): void {
    this.mobileMenuOpen = false;
    const sectionMap: Record<string, string> = {
      'Home': 'hero', 'Features': 'features', 'How It Works': 'how',
      'Roles': 'roles', 'Contact': 'footer'
    };
    const el = document.getElementById(sectionMap[id] || id.toLowerCase());
    el?.scrollIntoView({ behavior: 'smooth' });
  }

  startCarousel(): void {
    this.carouselTimer = setInterval(() => {
      this.activeTestimonial = (this.activeTestimonial + 1) % this.testimonials.length;
    }, 4500);
  }

  pauseCarousel(): void { clearInterval(this.carouselTimer); }
  resumeCarousel(): void { this.startCarousel(); }

  goToTestimonial(i: number): void {
    this.activeTestimonial = i;
    clearInterval(this.carouselTimer);
    this.startCarousel();
  }

  toggleFaq(faq: Faq): void {
    faq.open = !faq.open;
  }

  private initStatsObserver(): void {
    const strip = document.getElementById('stats');
    if (!strip) return;
    this.statsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.statsAnimated) {
        this.statsAnimated = true;
        this.animateStats();
      }
    }, { threshold: 0.3 });
    this.statsObserver.observe(strip);
  }

  private animateStats(): void {
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      this.stats.forEach(s => s.current = Math.round(ease * s.end));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }

  stars(n: number): number[] { return Array(n).fill(0); }
}
