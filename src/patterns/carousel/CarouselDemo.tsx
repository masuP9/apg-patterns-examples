import { Carousel } from './Carousel';

function createDemoSlides(basePath: string) {
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return [
    {
      id: 'slide1',
      label: 'Featured Product',
      content: (
        <img
          src={`${base}/images/carousel/slide-1.svg`}
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
          src={`${base}/images/carousel/slide-2.svg`}
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
          src={`${base}/images/carousel/slide-3.svg`}
          alt="Special Offer - Limited time discount"
          className="apg-carousel-image"
        />
      ),
    },
  ];
}

function createAutoRotateSlides(basePath: string) {
  const base = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  return [
    {
      id: 'auto1',
      label: 'Breaking News',
      content: (
        <img
          src={`${base}/images/carousel/slide-4.svg`}
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
          src={`${base}/images/carousel/slide-5.svg`}
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
          src={`${base}/images/carousel/slide-6.svg`}
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
          src={`${base}/images/carousel/slide-7.svg`}
          alt="Entertainment - New releases and trending"
          className="apg-carousel-image"
        />
      ),
    },
  ];
}

export interface CarouselDemoProps {
  variant?: 'default' | 'auto-rotate';
  basePath?: string;
}

export function CarouselDemo({ variant = 'default', basePath = '' }: CarouselDemoProps) {
  if (variant === 'auto-rotate') {
    return (
      <Carousel
        slides={createAutoRotateSlides(basePath)}
        aria-label="News highlights"
        autoRotate
        rotationInterval={5000}
        data-testid="carousel-auto"
      />
    );
  }

  return (
    <Carousel
      slides={createDemoSlides(basePath)}
      aria-label="Featured content"
      data-testid="carousel-manual"
    />
  );
}

export default CarouselDemo;
