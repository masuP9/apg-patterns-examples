import { Carousel } from './Carousel';

const demoSlides = [
  {
    id: 'slide1',
    label: 'Featured Product',
    content: (
      <img
        src="/images/carousel/slide-1.svg"
        alt="Featured Product - Discover our latest offering"
        className="apg-carousel-image"
      />
    ),
  },
  {
    id: 'slide2',
    label: 'New Arrivals',
    content: (
      <img
        src="/images/carousel/slide-2.svg"
        alt="New Arrivals - Check out the newest additions"
        className="apg-carousel-image"
      />
    ),
  },
  {
    id: 'slide3',
    label: 'Special Offer',
    content: (
      <img
        src="/images/carousel/slide-3.svg"
        alt="Special Offer - Limited time discount"
        className="apg-carousel-image"
      />
    ),
  },
];

const autoRotateSlides = [
  {
    id: 'auto1',
    label: 'Breaking News',
    content: (
      <img
        src="/images/carousel/slide-4.svg"
        alt="Breaking News - Stay updated with the latest"
        className="apg-carousel-image"
      />
    ),
  },
  {
    id: 'auto2',
    label: 'Weather Update',
    content: (
      <img
        src="/images/carousel/slide-5.svg"
        alt="Weather Update - Sunny skies expected"
        className="apg-carousel-image"
      />
    ),
  },
  {
    id: 'auto3',
    label: 'Sports Highlights',
    content: (
      <img
        src="/images/carousel/slide-6.svg"
        alt="Sports Highlights - Catch up on game results"
        className="apg-carousel-image"
      />
    ),
  },
  {
    id: 'auto4',
    label: 'Entertainment',
    content: (
      <img
        src="/images/carousel/slide-7.svg"
        alt="Entertainment - New releases and trending"
        className="apg-carousel-image"
      />
    ),
  },
];

export interface CarouselDemoProps {
  variant?: 'default' | 'auto-rotate';
}

export function CarouselDemo({ variant = 'default' }: CarouselDemoProps) {
  if (variant === 'auto-rotate') {
    return (
      <Carousel
        slides={autoRotateSlides}
        aria-label="News highlights"
        autoRotate
        rotationInterval={5000}
        data-testid="carousel-auto"
      />
    );
  }

  return <Carousel slides={demoSlides} aria-label="Featured content" data-testid="carousel-demo" />;
}

export default CarouselDemo;
