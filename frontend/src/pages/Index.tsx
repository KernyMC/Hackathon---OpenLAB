import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useRef } from "react";
import { 
  Building2, 
  Shield, 
  Target, 
  BarChart3, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Star,
  Quote,
  Mail,
  Phone,
  MapPin,
  Heart,
  Eye,
  Lightbulb,
  MapPin as Location,
  Calendar,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  Award,
  TrendingUp,
  Clock,
  UserCheck,
  Globe,
  CreditCard,
  AlertCircle
} from "lucide-react";
import PpxButtonGlobalSimple from "@/components/payment/PpxButtonGlobalSimple";
import { data as pluxData } from "@/configuration/ppx.global-simple";

// Componente para contador animado
const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

// Componente para scroll suave
const SmoothScrollLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

// Datos de proyectos con imágenes
const projectsData = [
  {
    id: 1,
    title: "Alimentación Infantil",
    description: "Proyecto de nutrición para niños de 0-5 años en comunidades rurales de Imbabura.",
    location: "Imbabura",
    budget: 15000,
    progress: 75,
    images: [
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop"
    ],
    impact: "500+ niños beneficiados",
    status: "En Progreso",
    startDate: "Enero 2024",
    endDate: "Diciembre 2024"
  },
  {
    id: 2,
    title: "Apoyo a Madres Solteras",
    description: "Capacitación y microcréditos para emprendimientos de madres cabeza de familia.",
    location: "Guayaquil",
    budget: 25000,
    progress: 60,
    images: [
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0c2a0a4b0c0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
    ],
    impact: "200+ madres empoderadas",
    status: "En Progreso",
    startDate: "Marzo 2024",
    endDate: "Marzo 2025"
  },
  {
    id: 3,
    title: "Educación Rural",
    description: "Dotación de materiales educativos y capacitación docente en escuelas rurales.",
    location: "Manabí",
    budget: 18000,
    progress: 90,
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop"
    ],
    impact: "300+ estudiantes",
    status: "Casi Completado",
    startDate: "Febrero 2024",
    endDate: "Noviembre 2024"
  },
  {
    id: 4,
    title: "Vivienda Digna",
    description: "Construcción de viviendas de emergencia para familias afectadas por desastres naturales.",
    location: "Esmeraldas",
    budget: 35000,
    progress: 45,
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
    ],
    impact: "50+ familias",
    status: "En Progreso",
    startDate: "Abril 2024",
    endDate: "Agosto 2025"
  },
  {
    id: 5,
    title: "Salud Comunitaria",
    description: "Brigadas médicas y campañas de prevención en comunidades de difícil acceso.",
    location: "Loja",
    budget: 22000,
    progress: 80,
    images: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop"
    ],
    impact: "1,000+ personas atendidas",
    status: "En Progreso",
    startDate: "Enero 2024",
    endDate: "Diciembre 2024"
  },
  {
    id: 6,
    title: "Protección Infantil",
    description: "Programas de prevención de violencia y apoyo psicológico para niños en riesgo.",
    location: "Pichincha",
    budget: 28000,
    progress: 65,
    images: [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop"
    ],
    impact: "150+ niños protegidos",
    status: "En Progreso",
    startDate: "Marzo 2024",
    endDate: "Febrero 2025"
  }
  ,
  {
    id: 7,
    title: "Agua Limpia para Comunidades",
    description: "Instalación de sistemas de purificación y acceso a agua potable en zonas rurales.",
    location: "Chimborazo",
    budget: 26000,
    progress: 40,
    images: [
      "https://images.unsplash.com/photo-1508873699372-7aeab60b44ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&h=600&fit=crop"
    ],
    impact: "20+ comunidades con acceso seguro",
    status: "En Progreso",
    startDate: "Mayo 2024",
    endDate: "Diciembre 2025"
  },
  {
    id: 8,
    title: "Reforestación Andina",
    description: "Siembra de especies nativas y educación ambiental para cuidar cuencas hídricas.",
    location: "Azuay",
    budget: 14000,
    progress: 55,
    images: [
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    ],
    impact: "10,000+ árboles plantados",
    status: "En Progreso",
    startDate: "Junio 2024",
    endDate: "Junio 2025"
  },
  {
    id: 9,
    title: "Empleabilidad Juvenil",
    description: "Formación técnica y vinculación laboral para jóvenes en situación de vulnerabilidad.",
    location: "El Oro",
    budget: 30000,
    progress: 35,
    images: [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop"
    ],
    impact: "400+ jóvenes capacitados",
    status: "En Progreso",
    startDate: "Julio 2024",
    endDate: "Julio 2025"
  },
  {
    id: 10,
    title: "Salud Materna",
    description: "Controles prenatales, talleres y kits para madres en comunidades rurales.",
    location: "Cotopaxi",
    budget: 20000,
    progress: 50,
    images: [
      "https://images.unsplash.com/photo-1598524374620-7fef26f2d9c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542736667-069246bdbc74?w=800&h=600&fit=crop"
    ],
    impact: "300+ madres acompañadas",
    status: "En Progreso",
    startDate: "Agosto 2024",
    endDate: "Enero 2026"
  }
];

// Datos de ONGs (17 organizaciones)
const ngosData = [
  {
    id: 1,
    name: "Banco de Alimentos Quito",
    description: "Luchando contra el hambre en la capital ecuatoriana, distribuyendo alimentos a familias vulnerables y comedores comunitarios.",
    location: "Quito, Pichincha",
    beneficiaries: 2500,
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop",
    founded: "2015",
    focus: ["Alimentación", "Pobreza", "Comunidad"],
    website: "https://bancodealimentosquito.org",
    contact: "info@bancodealimentosquito.org"
  },
  {
    id: 2,
    name: "Fundación Amiga",
    description: "Apoyando a madres solteras y niños en situación de riesgo, brindando educación, alimentación y oportunidades de desarrollo.",
    location: "Guayaquil, Guayas",
    beneficiaries: 1800,
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    founded: "2012",
    focus: ["Mujeres", "Niños", "Educación"],
    website: "https://fundacionamiga.org",
    contact: "contacto@fundacionamiga.org"
  },
  {
    id: 3,
    name: "Banco de Alimentos Cuenca",
    description: "Promoviendo la seguridad alimentaria en el sur del país, con programas de nutrición infantil y apoyo a adultos mayores.",
    location: "Cuenca, Azuay",
    beneficiaries: 1200,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    founded: "2018",
    focus: ["Alimentación", "Adultos Mayores", "Nutrición"],
    website: "https://bancodealimentoscuenca.org",
    contact: "info@bancodealimentoscuenca.org"
  },
  {
    id: 4,
    name: "Fundación Niños del Ecuador",
    description: "Protegiendo los derechos de la niñez ecuatoriana a través de programas de educación, salud y protección integral.",
    location: "Quito, Pichincha",
    beneficiaries: 3200,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    founded: "2010",
    focus: ["Niños", "Educación", "Salud"],
    website: "https://ninosdelecuador.org",
    contact: "info@ninosdelecuador.org"
  },
  {
    id: 5,
    name: "Fundación Esperanza",
    description: "Trabajando por la inclusión social de personas con discapacidad, promoviendo oportunidades de empleo y desarrollo personal.",
    location: "Guayaquil, Guayas",
    beneficiaries: 950,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    founded: "2016",
    focus: ["Discapacidad", "Inclusión", "Empleo"],
    website: "https://fundacionesperanza.org",
    contact: "contacto@fundacionesperanza.org"
  },
  {
    id: 6,
    name: "Fundación Verde Ecuador",
    description: "Conservando el medio ambiente ecuatoriano a través de programas de reforestación, educación ambiental y desarrollo sostenible.",
    location: "Cuenca, Azuay",
    beneficiaries: 1500,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    founded: "2014",
    focus: ["Medio Ambiente", "Sostenibilidad", "Educación"],
    website: "https://verdeecuador.org",
    contact: "info@verdeecuador.org"
  },
  {
    id: 7,
    name: "Fundación Salud Rural",
    description: "Llevando servicios de salud a comunidades rurales remotas del Ecuador, con brigadas médicas y programas preventivos.",
    location: "Ambato, Tungurahua",
    beneficiaries: 2800,
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    founded: "2017",
    focus: ["Salud", "Rural", "Prevención"],
    website: "https://saludrural.org",
    contact: "info@saludrural.org"
  },
  {
    id: 8,
    name: "Fundación Mujeres Emprendedoras",
    description: "Empoderando a mujeres ecuatorianas a través de capacitación, microcréditos y apoyo para emprendimientos sostenibles.",
    location: "Portoviejo, Manabí",
    beneficiaries: 1200,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop",
    founded: "2019",
    focus: ["Mujeres", "Emprendimiento", "Microcréditos"],
    website: "https://mujeresemprendedoras.org",
    contact: "contacto@mujeresemprendedoras.org"
  },
  {
    id: 9,
    name: "Fundación Ancianos Dignos",
    description: "Cuidando y protegiendo a los adultos mayores ecuatorianos, brindando atención integral y compañía en sus últimos años.",
    location: "Loja, Loja",
    beneficiaries: 800,
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    founded: "2013",
    focus: ["Adultos Mayores", "Dignidad", "Cuidado"],
    website: "https://ancianosdignos.org",
    contact: "info@ancianosdignos.org"
  },
  {
    id: 10,
    name: "Fundación Deportes para Todos",
    description: "Promoviendo el deporte como herramienta de desarrollo social, especialmente en barrios vulnerables y zonas rurales.",
    location: "Machala, El Oro",
    beneficiaries: 2100,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    founded: "2020",
    focus: ["Deportes", "Juventud", "Desarrollo Social"],
    website: "https://deportesparatodos.org",
    contact: "info@deportesparatodos.org"
  },
  {
    id: 11,
    name: "Fundación Arte y Cultura",
    description: "Preservando y promoviendo la cultura ecuatoriana a través de talleres artísticos, eventos culturales y rescate patrimonial.",
    location: "Riobamba, Chimborazo",
    beneficiaries: 1400,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    founded: "2011",
    focus: ["Cultura", "Arte", "Patrimonio"],
    website: "https://arteycultura.org",
    contact: "contacto@arteycultura.org"
  },
  {
    id: 12,
    name: "Fundación Vivienda Digna",
    description: "Construyendo hogares seguros y dignos para familias ecuatorianas de escasos recursos, con programas de autoconstrucción.",
    location: "Esmeraldas, Esmeraldas",
    beneficiaries: 1800,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
    founded: "2018",
    focus: ["Vivienda", "Construcción", "Familias"],
    website: "https://viviendadigna.org",
    contact: "info@viviendadigna.org"
  },
  {
    id: 13,
    name: "Fundación Tecnología Rural",
    description: "Llevando tecnología y conectividad a comunidades rurales, facilitando acceso a educación digital y oportunidades económicas.",
    location: "Ibarra, Imbabura",
    beneficiaries: 1100,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    founded: "2021",
    focus: ["Tecnología", "Rural", "Educación Digital"],
    website: "https://tecnologiarural.org",
    contact: "info@tecnologiarural.org"
  },
  {
    id: 14,
    name: "Fundación Agua Limpia",
    description: "Garantizando acceso a agua potable y saneamiento básico en comunidades rurales y urbanas marginadas del Ecuador.",
    location: "Santo Domingo, Santo Domingo de los Tsáchilas",
    beneficiaries: 2600,
    image: "https://images.unsplash.com/photo-1541544741938-0af808899cc4?w=400&h=300&fit=crop",
    founded: "2015",
    focus: ["Agua", "Saneamiento", "Infraestructura"],
    website: "https://agualimpia.org",
    contact: "contacto@agualimpia.org"
  },
  {
    id: 15,
    name: "Fundación Educación Rural",
    description: "Mejorando la calidad educativa en zonas rurales remotas, con programas de capacitación docente y dotación de materiales.",
    location: "Zamora, Zamora Chinchipe",
    beneficiaries: 1900,
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
    founded: "2012",
    focus: ["Educación", "Rural", "Capacitación"],
    website: "https://educacionrural.org",
    contact: "info@educacionrural.org"
  },
  {
    id: 16,
    name: "Fundación Empleo Joven",
    description: "Creando oportunidades laborales para jóvenes ecuatorianos, con programas de capacitación técnica y vinculación empresarial.",
    location: "Manta, Manabí",
    beneficiaries: 1600,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
    founded: "2019",
    focus: ["Juventud", "Empleo", "Capacitación"],
    website: "https://empleojoven.org",
    contact: "info@empleojoven.org"
  },
  {
    id: 17,
    name: "Fundación Comunidad Unida",
    description: "Fortalociendo el tejido social ecuatoriano a través de programas comunitarios, liderazgo local y desarrollo participativo.",
    location: "Tulcán, Carchi",
    beneficiaries: 2200,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    founded: "2016",
    focus: ["Comunidad", "Liderazgo", "Participación"],
    website: "https://comunidadunida.org",
    contact: "contacto@comunidadunida.org"
  }
];

// Imágenes temáticas para el carrusel del hero
const heroImages = [
  {
    id: 1,
    src: "https://fundacionfavorita.org/wp-content/uploads/2023/05/nino2.png",
    alt: "Niño sonriendo - Fundación Favorita",
    title: "Niñez Feliz",
    description: "Construyendo sonrisas y esperanzas"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop",
    alt: "Madres trabajando juntas",
    title: "Madres Empoderadas",
    description: "Fortaleciendo a las mujeres ecuatorianas"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop",
    alt: "Niños en la escuela",
    title: "Educación de Calidad",
    description: "Garantizando el futuro de nuestros niños"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
    alt: "Profesionales de la salud",
    title: "Salud Comunitaria",
    description: "Cuidando la salud de nuestras comunidades"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    alt: "Naturaleza y medio ambiente",
    title: "Medio Ambiente",
    description: "Protegiendo nuestro planeta"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    alt: "Jóvenes trabajando",
    title: "Empleo Joven",
    description: "Creando oportunidades laborales"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    alt: "Familias unidas",
    title: "Familias Unidas",
    description: "Fortalociendo los lazos familiares"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
    alt: "Comunidad trabajando juntos",
    title: "Comunidad Activa",
    description: "Construyendo comunidades solidarias"
  }
];

const Index = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedProject, setSelectedProject] = useState(projectsData[0]);
  const [selectedNGO, setSelectedNGO] = useState(ngosData[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState(50);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [currentNGOIndex, setCurrentNGOIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [isHeroAutoPlaying, setIsHeroAutoPlaying] = useState(true);

  // Scroll spy para navegación
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'mission', 'ngos', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Auto-play para el carrusel de ONGs
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentNGOIndex((prevIndex) => (prevIndex + 1) % ngosData.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Auto-play para el carrusel del hero
  useEffect(() => {
    if (!isHeroAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [isHeroAutoPlaying]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedProject.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length);
  };

  // Funciones para manejar el pago
  const handlePaymentSuccess = (response: any) => {
    console.log('Pago exitoso:', response);
    setPaymentSuccess(true);
    setShowPaymentForm(false);
    
    // Aquí podrías enviar los datos al backend para registrar la donación
    // const donationData = {
    //   amount: donationAmount,
    //   projectId: selectedProject.id,
    //   transactionId: response.id_transaccion,
    //   cardType: response.cardType,
    //   cardIssuer: response.cardIssuer,
    //   clientName: response.clientName,
    //   fecha: response.fecha,
    //   token: response.token
    // };
    // Enviar al backend...
  };

  const handlePaymentError = (error: any) => {
    console.error('Error en el pago:', error);
    setShowPaymentForm(false);
    // Aquí podrías mostrar un mensaje de error al usuario
  };

  const handleDonateClick = () => {
    // Transición inmediata al formulario de pago
    setShowPaymentForm(true);
    setPaymentSuccess(false);
    
    // Pre-cargar el componente de pago para mayor velocidad
    setTimeout(() => {
      // Forzar re-render del componente de pago
      const event = new CustomEvent('pluxPreload', { 
        detail: { 
          amount: donationAmount, 
          description: `Donación para ${selectedProject.title}` 
        } 
      });
      window.dispatchEvent(event);
    }, 100);
  };

  const resetDonationModal = () => {
    setShowPaymentForm(false);
    setPaymentSuccess(false);
    setDonationAmount(50);
    setSelectedProject(projectsData[0]);
  };

  // Crear datos de pago dinámicos
  const createPaymentData = () => {
    const paymentData = {
      ...pluxData,
      PayboxBase12: donationAmount.toFixed(2),
      PayboxDescription: `Donación para ${selectedProject.title}`,
      PayboxSendname: "Donante",
      PayboxSendmail: "donante@ejemplo.com"
    };
    
    console.log("Datos de pago creados:", paymentData);
    return paymentData;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="https://fundacionfavorita.org/wp-content/uploads/2023/01/LOGO-FF-NUEVO.png" 
                  alt="Fundación Favorita" 
                  className="h-16 w-auto"
                />
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <SmoothScrollLink href="#mission" className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${activeSection === 'mission' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                  Misión
                </SmoothScrollLink>
                <SmoothScrollLink href="#ngos" className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${activeSection === 'ngos' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                  ONGs Asociadas
                </SmoothScrollLink>
                <SmoothScrollLink href="#projects" className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${activeSection === 'projects' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                  Proyectos
                </SmoothScrollLink>
                <SmoothScrollLink href="#contact" className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${activeSection === 'contact' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                  Contacto
                </SmoothScrollLink>
                <Button 
                  onClick={() => setIsDonationModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 text-sm font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Donar Ahora
                </Button>
              </div>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button 
                onClick={() => setIsDonationModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-semibold rounded-full hover:scale-105 transition-transform"
              >
                Donar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-white via-red-50/30 to-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fecaca%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Texto Principal */}
            <div className="text-center lg:text-left">
            
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
              Construyendo un Ecuador
              <span className="text-red-600 block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Más Solidario
              </span>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium mb-6 animate-pulse">
              <Award className="w-4 h-4 mr-2" />
                Juntos construimos un Ecuador solidario y con futuro.
              </div>
            </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 leading-relaxed">
              Conectamos organizaciones, potenciamos proyectos sociales y generamos 
              <span className="font-semibold text-red-600"> impacto real</span> en las comunidades más vulnerables del Ecuador.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  onClick={() => setIsDonationModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Donar Aquí
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Carrusel de Imágenes Temáticas */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
                {/* Contenedor del carrusel circular */}
                <div className="relative">
                  {/* Keyframes para aro animado */}
                  <style dangerouslySetInnerHTML={{
                    __html: `
                      @keyframes spinSlow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                      }
                    `
                  }} />
                  {/* Imagen circular con animación */}
                  <div className="relative w-80 h-80 mx-auto">
                    {/* Círculo de fondo con gradiente */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-red-200 to-pink-200 rounded-full blur-2xl opacity-30"></div>

                    {/* Aro punteado animado alrededor */}
                    <svg
                      className="pointer-events-none absolute -inset-3 w-[calc(100%+24px)] h-[calc(100%+24px)]"
                      viewBox="0 0 100 100"
                      style={{ animation: 'spinSlow 18s linear infinite' }}
                      aria-hidden="true"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="47"
                        fill="none"
                        stroke="rgba(239,68,68,0.35)"
                        strokeWidth="1.2"
                        strokeDasharray="2 6"
                      />
                    </svg>
                    
                    {/* Imagen circular mejorada con aro y sombras sutiles */}
                    <div className="relative w-full h-full z-10">
                      {/* Aro exterior sutil */}
                      <div className="absolute -inset-1 rounded-full border-2 border-red-200/60"></div>
                      
                      <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl">
                        <img 
                          key={currentHeroImageIndex}
                          src={heroImages[currentHeroImageIndex].src} 
                          alt={heroImages[currentHeroImageIndex].alt} 
                          className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform"
                          style={{
                            animation: 'fadeInScale 1s ease-in-out'
                          }}
                        />
                      </div>
                    </div>

                    {/* Sin mancha exterior: diseño limpio */}
                    
                    {/* Chip decorativo profesional */}
                    <div className="absolute -top-2 -right-2 px-3 py-1 rounded-full bg-red-600 text-white shadow-lg border-2 border-white text-xs font-semibold">
                      Acción Social
                    </div>
                    
                   
                    
                  </div>
                  
                  
                </div>
              </div>
            </div>
            </div>
            
            {/* Stats Preview */}
          <div className="mt-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  <AnimatedCounter end={15} />
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">ONGs Asociadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  <AnimatedCounter end={50} />
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Proyectos Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  <AnimatedCounter end={5000} />
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Familias Beneficiadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  $<AnimatedCounter end={2} />M+
                </div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">Inversión Social</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Fundación Favorita Section */}
      <section id="mission" className="bg-white py-20 lg:py-28 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-blue-50/30"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header con decoración */}
          <div className="text-center mb-16">
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Sobre <span className="text-red-600">Fundación Favorita</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>
          </div>

          {/* Contenido Principal (nuevo orden: Misión | 70 Años | Visión, y abajo Nuestra Historia) */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Misión */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Misión</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
              Mejorar la calidad de vida de personas
vulnerables en el Ecuador, con acciones
de nutrición, educación, emprendimiento,
medio ambiente y equidad de género, a
través del apoyo a aliados estratégicos
ejecutores, sobre planes de acción
concretos.
              </p>
            </div>

            {/* 70 Años */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-200 to-blue-200 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col">
                <img 
                  src="https://fundacionfavorita.org/wp-content/uploads/2023/05/70-anos-cf.png" 
                  alt="70 años trabajando para Ecuador" 
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-4 text-center">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">TRABAJANDO PARA ECUADOR</h4>
                  <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Visión */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Visión</h4>
              </div>
              <p className="text-gray-600 leading-relaxed">
              Lograr un Ecuador sostenible, en donde
todas las personas tengan una buena
calidad de vida.
              </p>
            </div>

            {/* Nuestra Historia (full width debajo) */}
            <div className="lg:col-span-3 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 lg:p-10 shadow-lg border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Historia</h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    
                    Fundación Favorita nació para asumir y liderar las actividades de valor compartido en las que ha
                    venido trabajando Corporación Favorita desde hace 70 años. Es una organización de segundo piso con
                    una visión nacional y un enfoque integral.
                  </p>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ONGs Asociadas - Carrusel Moderno */}
      <section id="ngos" className="bg-gradient-to-br from-gray-50 via-white to-red-50/30 py-20 lg:py-28 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23fecaca%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-16">
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              ONGs <span className="text-red-600">Asociadas</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full"></div>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <span className="text-2xl font-bold text-black-600">{ngosData.length}</span> organizaciones que confían en nosotros para gestionar sus proyectos de ayuda social
            </p>
          </div>

          {/* Carrusel Principal */}
          <div className="relative">
            {/* ONG Destacada */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Imagen */}
                <div className="relative h-80 lg:h-96">
                  <img 
                    src={ngosData[currentNGOIndex].image} 
                    alt={ngosData[currentNGOIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold mb-2">{ngosData[currentNGOIndex].name}</h3>
                        <p className="text-sm opacity-90">{ngosData[currentNGOIndex].location}</p>
                          </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-400">
                          {ngosData[currentNGOIndex].beneficiaries.toLocaleString()}+
                          </div>
                        <div className="text-xs opacity-90">beneficiarios</div>
                          </div>
                        </div>
                  </div>
                </div>

                {/* Información */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                        <Building2 className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Fundada en {ngosData[currentNGOIndex].founded}</h4>
                        <p className="text-sm text-gray-600">Años de experiencia</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    {ngosData[currentNGOIndex].description}
                  </p>

                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Áreas de Enfoque</h5>
                        <div className="flex flex-wrap gap-2">
                      {ngosData[currentNGOIndex].focus.map((area, index) => (
                        <Badge key={index} className="bg-red-100 text-red-800 px-3 py-1">
                              {area}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    
                  <div className="flex items-center space-x-4">
                    <Button 
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
                      onClick={() => setSelectedNGO(ngosData[currentNGOIndex])}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                    <Button 
                      className="border border-red-300 text-red-600 hover:bg-red-50 px-6 py-3 rounded-full"
                      onClick={() => window.open(ngosData[currentNGOIndex].website, '_blank')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Sitio Web
                    </Button>
                        </div>
                        </div>
                      </div>
                    </div>

            

            {/* Auto-play Control */}
            <div className="flex items-center justify-center space-x-4">
             
              
                      </div>
                    </div>

          
        </div>
      </section>

      {/* Impacto en Números - Compacto con Animaciones de Líneas Curvas */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 py-12 relative overflow-hidden">
        {/* Animaciones de Líneas Curvas Negras */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1200 200" fill="none">
            {/* Línea curva principal */}
            <path 
              d="M0,100 Q300,50 600,100 T1200,100" 
              stroke="rgba(0,0,0,0.15)" 
              strokeWidth="2" 
              fill="none"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              className="animate-draw-line"
              style={{
                animation: 'drawLine 3s ease-in-out forwards'
              }}
            />
            {/* Línea curva secundaria */}
            <path 
              d="M0,150 Q400,120 800,150 T1200,150" 
              stroke="rgba(0,0,0,0.1)" 
              strokeWidth="1.5" 
              fill="none"
              strokeDasharray="800"
              strokeDashoffset="800"
              className="animate-draw-line"
              style={{
                animation: 'drawLine 2.5s ease-in-out 0.5s forwards'
              }}
            />
            {/* Círculo animado */}
            <circle 
              cx="100" 
              cy="50" 
              r="20" 
              stroke="rgba(0,0,0,0.2)" 
              strokeWidth="2" 
              fill="none"
              strokeDasharray="125"
              strokeDashoffset="125"
              className="animate-draw-line"
              style={{
                animation: 'drawLine 2s ease-in-out 1s forwards'
              }}
            />
            {/* Línea diagonal */}
            <path 
              d="M1100,30 L1150,80" 
              stroke="rgba(0,0,0,0.12)" 
              strokeWidth="1" 
              fill="none"
              strokeDasharray="70"
              strokeDashoffset="70"
              className="animate-draw-line"
              style={{
                animation: 'drawLine 1.5s ease-in-out 1.5s forwards'
              }}
            />
          </svg>
          </div>
          
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header Compacto */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">Nuestro Impacto</h2>
            <p className="text-red-100 text-lg">Resultados que demuestran nuestro valor</p>
          </div>
          
          {/* Stats en una línea compacta */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {/* ONGs */}
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                <AnimatedCounter end={17} />
              </div>
              <div className="text-red-100 text-sm font-medium">ONGs</div>
            </div>

            {/* Proyectos */}
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                <AnimatedCounter end={50} />
              </div>
              <div className="text-red-100 text-sm font-medium">Proyectos</div>
            </div>

            {/* Familias */}
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                <AnimatedCounter end={5000} />
              </div>
              <div className="text-red-100 text-sm font-medium">Familias</div>
            </div>

            {/* Inversión */}
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                $<AnimatedCounter end={2} />M+
              </div>
              <div className="text-red-100 text-sm font-medium">Inversión</div>
            </div>
          </div>

          {/* Stats adicionales ultra compactas */}
          <div className="mt-6 flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                <AnimatedCounter end={24} />
        </div>
              <div className="text-red-200 text-xs">Provincias</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                <AnimatedCounter end={95} />
              </div>
              <div className="text-red-200 text-xs">% Satisfacción</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                <AnimatedCounter end={3} />
              </div>
              <div className="text-red-200 text-xs">Años</div>
            </div>
          </div>
        </div>

        {/* CSS para animación de dibujo */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes drawLine {
              to {
                stroke-dashoffset: 0;
              }
            }
          `
        }} />
      </section>

      {/* CSS para animaciones del carrusel del hero */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `
      }} />

      {/* Projects Section */}
      <section id="projects" className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Proyectos Activos
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Proyectos en <span className="text-red-600">Ejecución</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce los proyectos que estamos apoyando en diferentes comunidades del Ecuador y su impacto real
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {projectsData.map((project) => (
              <Dialog key={project.id}>
                <DialogTrigger asChild>
                  <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-105 overflow-hidden">
                    {/* Solo imagen y nombre - Minimalista */}
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={project.images[0]} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      
                      {/* Badge de estado */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-600 text-white text-xs px-2 py-1 shadow-lg">
                          {project.status}
                        </Badge>
                      </div>
                      
                      {/* Nombre del proyecto superpuesto */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-sm leading-tight group-hover:text-red-300 transition-colors duration-300">
                        {project.title}
                      </h3>
                        </div>
                      
                      {/* Overlay de hover */}
                      <div className="absolute inset-0 bg-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
          </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-0 overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Imagen compacta */}
                    <div className="relative">
                      <div className="aspect-video md:aspect-square w-full h-full overflow-hidden">
                        <img 
                          src={project.images[0]}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Detalle simple */}
                    <div className="p-6 md:p-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{project.title}</h3>
                          <div className="text-sm text-gray-500 flex items-center mb-3">
                            <Location className="w-4 h-4 mr-1" /> {project.location}
                          </div>
                        </div>
                        <Badge className="bg-red-600 text-white">{project.status}</Badge>
                      </div>

                      <p className="text-gray-700 text-sm md:text-base leading-relaxed line-clamp-5 mb-4">
                        {project.description}
                      </p>

                      <div className="space-y-2 mb-5">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Progreso</span>
                          <span className="text-red-600 font-semibold">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1 text-red-600" />
                        ${project.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (compacta) */}
      <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            ¿Quieres ser parte del <span className="text-red-600">cambio</span>?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-6 max-w-3xl mx-auto">
            Súmate para impulsar proyectos con impacto real en comunidades del Ecuador.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={() => setIsDonationModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
            >
              💝 Donar Ahora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link to="/ngo/projects">
              <Button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105">
                Ver Proyectos
              </Button>
            </Link>
          </div>

          {/* ODS compactas */}
          <div className="mt-6">
            <div className="text-gray-300 text-sm mb-3">ODS con las que contribuimos</div>
            <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
              {/* ODS en escala de grises (look profesional y sobrio) */}
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">2</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">4</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">5</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">8</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">13</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">17</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">1</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">3</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">10</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">11</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">12</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">14</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">15</div>
              <div className="w-9 h-9 rounded-md bg-gray-700 flex items-center justify-center text-white/90 text-xs font-bold ring-1 ring-white/10">16</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Fundación <span className="text-red-600">Favorita</span></h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Construyendo un Ecuador más solidario a través de la tecnología y la colaboración.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-3">
                <li><SmoothScrollLink href="#mission" className="text-gray-400 hover:text-white transition-colors">Misión y Visión</SmoothScrollLink></li>
                <li><SmoothScrollLink href="#ngos" className="text-gray-400 hover:text-white transition-colors">ONGs Asociadas</SmoothScrollLink></li>
                <li><SmoothScrollLink href="#projects" className="text-gray-400 hover:text-white transition-colors">Proyectos</SmoothScrollLink></li>
                <li><SmoothScrollLink href="#contact" className="text-gray-400 hover:text-white transition-colors">Contacto</SmoothScrollLink></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-3">
                <li><Link to="/ngo/projects" className="text-gray-400 hover:text-white transition-colors">Portal ONG</Link></li>
                <li><Link to="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors">Portal Admin</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Soporte</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-red-600" />
                  <span className="text-gray-400">info@fundacionfavorita.ec</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-red-600" />
                  <span className="text-gray-400">+593 2 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-red-600" />
                  <span className="text-gray-400">Quito, Ecuador</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Fundación Favorita. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Donación Renovado */}
        <Dialog open={isDonationModalOpen} onOpenChange={(open) => {
          setIsDonationModalOpen(open);
          if (!open) {
            resetDonationModal();
          }
        }}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg lg:max-w-xl max-h-[95vh] overflow-y-auto p-0 bg-white rounded-2xl shadow-2xl">
            {/* Header con Logo */}
            <DialogHeader className="px-8 pt-8 pb-6 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white rounded-t-2xl">
              <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                  src="https://fundacionfavorita.org/wp-content/uploads/2023/01/LOGO-FF-NUEVO.png" 
                  alt="Fundación Favorita" 
                  className="h-12 w-auto filter brightness-0 invert"
                />
                <div className="h-8 w-px bg-white/30"></div>
                <Heart className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-center">
                Apoya Nuestros Proyectos
            </DialogTitle>
              <DialogDescription className="text-red-100 text-center mt-2 text-sm">
                Tu donación transforma vidas
            </DialogDescription>
          </DialogHeader>
          
          {!showPaymentForm && !paymentSuccess ? (
            <div className="px-8 py-6 space-y-6">
              {/* Selección de Monto Simplificada */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 text-lg text-center">
                  💝 Selecciona el Monto
                </h4>
                
                {/* Montos Predefinidos - Grid más compacto */}
                <div className="grid grid-cols-3 gap-3">
                {[25, 50, 100, 250, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                      className={`py-3 px-4 text-sm font-bold transition-all duration-200 ${
                      donationAmount === amount 
                          ? "bg-red-600 text-white shadow-lg scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                    onClick={() => setDonationAmount(amount)}
                  >
                      ${amount}
                  </Button>
                ))}
              </div>
                
                {/* Monto Personalizado - Más compacto */}
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-bold text-center"
                    placeholder="Otro monto"
                    min="1"
                  />
                </div>
              </div>

              {/* Proyecto Seleccionado - Solo mostrar el seleccionado */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border-2 border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900">{selectedProject.title}</h5>
                    <p className="text-sm text-gray-600">{selectedProject.location}</p>
                  </div>
                  <Badge className="bg-red-600 text-white">Progreso: {selectedProject.progress}%</Badge>
              </div>
            </div>

              {/* Resumen Final */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl text-center">
                <div className="text-3xl font-bold mb-2">${donationAmount}</div>
                <div className="text-gray-300">Total a donar</div>
              </div>

              {/* Botón Principal */}
              <Button 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={handleDonateClick}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceder al Pago
              </Button>
            </div>
          ) : showPaymentForm ? (
            <div className="px-8 py-6 space-y-6">
              {/* Resumen de Pago */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-200">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-gray-900">${donationAmount}</div>
                  <div className="text-sm text-gray-600">{selectedProject.title}</div>
                  <Badge className="bg-blue-600 text-white">Plux Paybox</Badge>
                </div>
              </div>

              {/* Instrucciones Simplificadas */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="w-8 h-8 text-red-600" />
                </div>
            <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Botón de Pago Activado
                  </h3>
                  <p className="text-gray-600 text-sm">
                    El botón de pago aparecerá en la esquina inferior derecha de tu pantalla.
                  </p>
                    </div>
                  </div>

              {/* Tarjetas de Prueba Compactas */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-800">Tarjetas de Prueba</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-xs text-yellow-700">
                  <div><strong>VISA:</strong> 4540639936908783 | CVV: 123</div>
                  <div><strong>MASTERCARD:</strong> 5230428590692129 | CVV: 123</div>
                  <div><strong>DINERS:</strong> 36417200103608 | CVV: 123 | OTP: 123456</div>
              </div>
            </div>

              {/* Componente de pago Plux - Carga inmediata */}
              <PpxButtonGlobalSimple 
                data={createPaymentData()} 
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />

              {/* Botón de Cancelar */}
              <Button 
                className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                onClick={() => setShowPaymentForm(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar Donación
              </Button>
              </div>
          ) : paymentSuccess ? (
            <div className="px-8 py-8 text-center space-y-6">
              {/* Icono de éxito */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle className="w-10 h-10 text-white" />
            </div>

              {/* Mensaje de éxito */}
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-green-600">¡Donación Exitosa!</h3>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <div className="text-2xl font-bold text-green-700 mb-2">${donationAmount}</div>
                  <div className="text-gray-700 mb-2">Donación realizada exitosamente</div>
                  <div className="text-sm text-gray-600">
                    Proyecto: <strong>{selectedProject.title}</strong>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Recibirás un comprobante por correo electrónico
                </p>
              </div>
              
              {/* Botones de acción */}
              <div className="space-y-3">
              <Button 
                onClick={() => {
                    resetDonationModal();
                  setIsDonationModalOpen(false);
                }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Finalizar
              </Button>
              <Button 
                  className="w-full border-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 py-3"
                  onClick={() => {
                    setPaymentSuccess(false);
                    setShowPaymentForm(false);
                  }}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Hacer Otra Donación
              </Button>
            </div>
      </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
