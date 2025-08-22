import React, { useEffect, useRef, useCallback } from 'react';

// Moved outside the component as it's a pure utility function.
const getThemeColors = (element: HTMLElement): string[] => {
    if (typeof window === 'undefined' || !element) return ['#4ade80', '#86efac']; // Fallback for hacker theme
    const styles = getComputedStyle(element);
    return [
        styles.getPropertyValue('--accent-primary').trim(),
        styles.getPropertyValue('--accent-primary-hover').trim(),
        styles.getPropertyValue('--text-secondary').trim(),
        styles.getPropertyValue('--border-accent').trim(),
    ];
};

interface ConfettiProps {
    isActive: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ isActive }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();
    const particles = useRef<any[]>([]);
    
    const createParticles = useCallback(() => {
        const particleCount = 200;
        const newParticles = [];
        const colors = getThemeColors(document.documentElement);
        const canvas = canvasRef.current;
        if (!canvas) return;

        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                x: canvas.width / 2,
                y: canvas.height - (canvas.height / 4),
                radius: Math.random() * 4 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                velocity: {
                    x: Math.random() * 16 - 8,
                    y: Math.random() * -20 - 15
                },
                alpha: 1,
                friction: 0.98,
                gravity: 0.4
            });
        }
        particles.current = newParticles;
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.current.forEach((particle, index) => {
            if (particle.alpha <= 0) {
                particles.current.splice(index, 1);
            } else {
                particle.velocity.y += particle.gravity;
                particle.velocity.x *= particle.friction;
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.alpha -= 0.01;

                ctx.save();
                ctx.globalAlpha = particle.alpha;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = particle.color;
                ctx.fill();
                ctx.restore();
            }
        });

        animationFrameId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (isActive) {
            createParticles();
            animationFrameId.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isActive, createParticles, animate]);

    if (!isActive) return null;

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[100]" />;
};

export default Confetti;