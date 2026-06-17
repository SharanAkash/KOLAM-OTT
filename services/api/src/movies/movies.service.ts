import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async createMovie(data: {
    title: string;
    description?: string;
    videoUrl: string;
    thumbnail: string;
    trailerUrl?: string;
    rating?: number;
    genres?: string[];
    releaseYear?: number;
    duration?: number;
  }) {
    return this.prisma.content.create({
      data: {
        title: data.title,
        description: data.description || '',
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail,
        trailerUrl: data.trailerUrl || '',
        rating: data.rating || 0,
        genres: data.genres || [],
        releaseYear: data.releaseYear || new Date().getFullYear(),
        duration: data.duration || 0,
        type: 'MOVIE',
        language: 'Tamil',
        isActive: true,
        isPremium: true,
      },
    });
  }

  async getAllMovies() {
    return this.prisma.content.findMany({
      where: {
        type: 'MOVIE',
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMovieById(id: string) {
    return this.prisma.content.findUnique({
      where: { id },
    });
  }

  async searchContent(query: string, limit: number = 5) {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.trim();

    // Search in title, description, and genres
    const results = await this.prisma.content.findMany({
      where: {
        isActive: true,
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            genres: {
              hasSome: [searchTerm],
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        type: true,
        releaseYear: true,
        genres: true,
      },
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return results;
  }
}
