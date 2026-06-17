import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../auth/guards/subscription.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createMovie(
    @Body()
    data: {
      title: string;
      description?: string;
      videoUrl: string;
      thumbnail: string;
      trailerUrl?: string;
      rating?: number;
      genres?: string[];
      releaseYear?: number;
      duration?: number;
    },
  ) {
    return this.moviesService.createMovie(data);
  }

  @Get('search')
  async searchContent(@Query('q') query: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.moviesService.searchContent(query, limitNum);
  }

  @Get()
  async getAllMovies() {
    return this.moviesService.getAllMovies();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  async getMovieById(@Param('id') id: string) {
    return this.moviesService.getMovieById(id);
  }
}
