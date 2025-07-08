"use client"

export interface MetaConfig {
  appId: string
  appSecret: string
  accessToken: string
  pageId: string
  adAccountId: string
}

export interface LinkedInConfig {
  clientId: string
  clientSecret: string
  accessToken: string
  organizationId: string
}

export interface InstagramConfig {
  accessToken: string
  businessAccountId: string
}

export interface SocialMediaPost {
  id: string
  platform: 'facebook' | 'instagram' | 'linkedin'
  content: string
  mediaUrls?: string[]
  scheduledFor?: Date
  publishedAt?: Date
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  engagement: {
    likes: number
    comments: number
    shares: number
    reach: number
    impressions: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface SocialMediaMetrics {
  platform: string
  followers: number
  engagement: number
  reach: number
  impressions: number
  posts: number
  topPost?: SocialMediaPost
  period: 'day' | 'week' | 'month'
}

export interface ScheduledPost {
  id: string
  platform: 'facebook' | 'instagram' | 'linkedin'
  content: string
  mediaUrls?: string[]
  scheduledFor: Date
  status: 'pending' | 'published' | 'failed'
  createdAt: Date
}

export class MetaBusinessIntegration {
  private config: MetaConfig
  private baseUrl = 'https://graph.facebook.com/v18.0'

  constructor(config: MetaConfig) {
    this.config = config
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const params = new URLSearchParams({ access_token: this.config.accessToken })
    
    if (options.method === 'GET' || !options.method) {
      const finalUrl = `${url}${url.includes('?') ? '&' : '?'}${params}`
      
      const response = await fetch(finalUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Meta API error: ${errorData.error?.message || response.statusText}`)
      }

      return response.json()
    } else {
      const formData = new FormData()
      
      if (options.body && typeof options.body === 'string') {
        const data = JSON.parse(options.body)
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
      }
      
      formData.append('access_token', this.config.accessToken)

      const response = await fetch(url, {
        ...options,
        body: formData,
        headers: {
          ...options.headers,
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Meta API error: ${errorData.error?.message || response.statusText}`)
      }

      return response.json()
    }
  }

  // Facebook Page Management
  async getPageInfo(): Promise<{
    id: string
    name: string
    followers: number
    category: string
    about?: string
    website?: string
  }> {
    const response = await this.makeApiRequest(`/${this.config.pageId}?fields=id,name,followers_count,category,about,website`)
    
    return {
      id: response.id,
      name: response.name,
      followers: response.followers_count || 0,
      category: response.category,
      about: response.about,
      website: response.website
    }
  }

  async publishPagePost(content: string, mediaUrls?: string[]): Promise<SocialMediaPost> {
    const data: any = { message: content }
    
    if (mediaUrls && mediaUrls.length > 0) {
      // For single image
      if (mediaUrls.length === 1) {
        data.url = mediaUrls[0]
      } else {
        // For multiple images, would need to upload each and create album
        data.url = mediaUrls[0] // Simplified for demo
      }
    }

    const response = await this.makeApiRequest(`/${this.config.pageId}/feed`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return {
      id: response.id,
      platform: 'facebook',
      content,
      mediaUrls,
      publishedAt: new Date(),
      status: 'published',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        impressions: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async schedulePagePost(content: string, scheduledFor: Date, mediaUrls?: string[]): Promise<ScheduledPost> {
    const data: any = { 
      message: content,
      published: false,
      scheduled_publish_time: Math.floor(scheduledFor.getTime() / 1000)
    }
    
    if (mediaUrls && mediaUrls.length > 0) {
      data.url = mediaUrls[0]
    }

    const response = await this.makeApiRequest(`/${this.config.pageId}/feed`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return {
      id: response.id,
      platform: 'facebook',
      content,
      mediaUrls,
      scheduledFor,
      status: 'pending',
      createdAt: new Date()
    }
  }

  async getPagePosts(limit: number = 25): Promise<SocialMediaPost[]> {
    const response = await this.makeApiRequest(
      `/${this.config.pageId}/posts?fields=id,message,created_time,full_picture,likes.summary(true),comments.summary(true),shares&limit=${limit}`
    )

    return response.data.map((post: any) => ({
      id: post.id,
      platform: 'facebook' as const,
      content: post.message || '',
      mediaUrls: post.full_picture ? [post.full_picture] : undefined,
      publishedAt: new Date(post.created_time),
      status: 'published' as const,
      engagement: {
        likes: post.likes?.summary?.total_count || 0,
        comments: post.comments?.summary?.total_count || 0,
        shares: post.shares?.count || 0,
        reach: 0, // Would need insights API
        impressions: 0
      },
      createdAt: new Date(post.created_time),
      updatedAt: new Date(post.created_time)
    }))
  }

  // Instagram Business Management
  async getInstagramAccount(): Promise<{
    id: string
    username: string
    followers: number
    media_count: number
  }> {
    const response = await this.makeApiRequest(
      `/${this.config.pageId}?fields=instagram_business_account{id,username,followers_count,media_count}`
    )

    const igAccount = response.instagram_business_account
    
    return {
      id: igAccount.id,
      username: igAccount.username,
      followers: igAccount.followers_count,
      media_count: igAccount.media_count
    }
  }

  async publishInstagramPost(
    imageUrl: string, 
    caption: string
  ): Promise<SocialMediaPost> {
    // First, create media object
    const mediaResponse = await this.makeApiRequest(`/${this.config.pageId}/instagram_business_account/media`, {
      method: 'POST',
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption
      }),
    })

    // Then publish it
    const publishResponse = await this.makeApiRequest(`/${this.config.pageId}/instagram_business_account/media_publish`, {
      method: 'POST',
      body: JSON.stringify({
        creation_id: mediaResponse.id
      }),
    })

    return {
      id: publishResponse.id,
      platform: 'instagram',
      content: caption,
      mediaUrls: [imageUrl],
      publishedAt: new Date(),
      status: 'published',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        impressions: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async getInstagramMedia(limit: number = 25): Promise<SocialMediaPost[]> {
    const response = await this.makeApiRequest(
      `/${this.config.pageId}/instagram_business_account/media?fields=id,caption,media_type,media_url,timestamp,like_count,comments_count&limit=${limit}`
    )

    return response.data.map((media: any) => ({
      id: media.id,
      platform: 'instagram' as const,
      content: media.caption || '',
      mediaUrls: [media.media_url],
      publishedAt: new Date(media.timestamp),
      status: 'published' as const,
      engagement: {
        likes: media.like_count || 0,
        comments: media.comments_count || 0,
        shares: 0,
        reach: 0,
        impressions: 0
      },
      createdAt: new Date(media.timestamp),
      updatedAt: new Date(media.timestamp)
    }))
  }

  // Analytics and Insights
  async getPageInsights(period: 'day' | 'week' | 'month' = 'day'): Promise<SocialMediaMetrics> {
    const since = new Date()
    const until = new Date()
    
    switch (period) {
      case 'day':
        since.setDate(since.getDate() - 1)
        break
      case 'week':
        since.setDate(since.getDate() - 7)
        break
      case 'month':
        since.setDate(since.getDate() - 30)
        break
    }

    const response = await this.makeApiRequest(
      `/${this.config.pageId}/insights?metric=page_impressions,page_reach,page_post_engagements&period=day&since=${since.toISOString().split('T')[0]}&until=${until.toISOString().split('T')[0]}`
    )

    const pageInfo = await this.getPageInfo()
    const posts = await this.getPagePosts()

    const insights = response.data.reduce((acc: any, metric: any) => {
      acc[metric.name] = metric.values[0]?.value || 0
      return acc
    }, {})

    return {
      platform: 'facebook',
      followers: pageInfo.followers,
      engagement: insights.page_post_engagements || 0,
      reach: insights.page_reach || 0,
      impressions: insights.page_impressions || 0,
      posts: posts.length,
      topPost: posts[0], // Most recent post as example
      period
    }
  }

  // Ad Management (basic)
  async getAdAccounts(): Promise<Array<{id: string, name: string, currency: string}>> {
    const response = await this.makeApiRequest('/me/adaccounts?fields=id,name,currency')
    
    return response.data.map((account: any) => ({
      id: account.id,
      name: account.name,
      currency: account.currency
    }))
  }

  async getAdInsights(
    adAccountId: string,
    dateRange: { start: Date, end: Date }
  ): Promise<{
    spend: number
    impressions: number
    clicks: number
    ctr: number
    cpm: number
    cpc: number
  }> {
    const timeRange = `{'since':'${dateRange.start.toISOString().split('T')[0]}','until':'${dateRange.end.toISOString().split('T')[0]}'}`
    
    const response = await this.makeApiRequest(
      `/${adAccountId}/insights?fields=spend,impressions,clicks,ctr,cpm,cpc&time_range=${encodeURIComponent(timeRange)}`
    )

    const data = response.data[0] || {}
    
    return {
      spend: parseFloat(data.spend) || 0,
      impressions: parseInt(data.impressions) || 0,
      clicks: parseInt(data.clicks) || 0,
      ctr: parseFloat(data.ctr) || 0,
      cpm: parseFloat(data.cpm) || 0,
      cpc: parseFloat(data.cpc) || 0
    }
  }
}

// LinkedIn Integration
export class LinkedInIntegration {
  private config: LinkedInConfig
  private baseUrl = 'https://api.linkedin.com/v2'

  constructor(config: LinkedInConfig) {
    this.config = config
  }

  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`LinkedIn API error: ${response.status} ${response.statusText} - ${errorData}`)
    }

    return response.json()
  }

  async getProfile(): Promise<{
    id: string
    firstName: string
    lastName: string
    headline?: string
  }> {
    const response = await this.makeApiRequest('/people/~:(id,firstName,lastName,headline)')
    
    return {
      id: response.id,
      firstName: response.firstName.localized[Object.keys(response.firstName.localized)[0]],
      lastName: response.lastName.localized[Object.keys(response.lastName.localized)[0]],
      headline: response.headline?.localized[Object.keys(response.headline.localized)[0]]
    }
  }

  async publishPost(content: string): Promise<SocialMediaPost> {
    const postData = {
      author: `urn:li:person:${this.config.organizationId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    }

    const response = await this.makeApiRequest('/ugcPosts', {
      method: 'POST',
      body: JSON.stringify(postData),
    })

    return {
      id: response.id,
      platform: 'linkedin',
      content,
      publishedAt: new Date(),
      status: 'published',
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
        reach: 0,
        impressions: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async getCompanyUpdates(companyId: string, count: number = 25): Promise<SocialMediaPost[]> {
    const response = await this.makeApiRequest(`/shares?q=owners&owners=urn:li:organization:${companyId}&count=${count}`)
    
    return response.elements.map((update: any) => ({
      id: update.id,
      platform: 'linkedin' as const,
      content: update.text?.text || '',
      publishedAt: new Date(update.created.time),
      status: 'published' as const,
      engagement: {
        likes: 0, // Would need separate API calls
        comments: 0,
        shares: 0,
        reach: 0,
        impressions: 0
      },
      createdAt: new Date(update.created.time),
      updatedAt: new Date(update.lastModified.time)
    }))
  }
}

// Unified Social Media Management
export class UnifiedSocialMediaManager {
  private meta?: MetaBusinessIntegration
  private linkedin?: LinkedInIntegration

  constructor(configs: {
    meta?: MetaConfig
    linkedin?: LinkedInConfig
  }) {
    if (configs.meta) this.meta = new MetaBusinessIntegration(configs.meta)
    if (configs.linkedin) this.linkedin = new LinkedInIntegration(configs.linkedin)
  }

  async publishToAllPlatforms(
    content: string, 
    mediaUrls?: string[]
  ): Promise<SocialMediaPost[]> {
    const posts: SocialMediaPost[] = []
    const promises: Promise<any>[] = []

    if (this.meta) {
      promises.push(
        this.meta.publishPagePost(content, mediaUrls)
          .then(post => posts.push(post))
          .catch(console.error)
      )

      if (mediaUrls && mediaUrls.length > 0) {
        promises.push(
          this.meta.publishInstagramPost(mediaUrls[0], content)
            .then(post => posts.push(post))
            .catch(console.error)
        )
      }
    }

    if (this.linkedin) {
      promises.push(
        this.linkedin.publishPost(content)
          .then(post => posts.push(post))
          .catch(console.error)
      )
    }

    await Promise.allSettled(promises)
    return posts
  }

  async schedulePost(
    platforms: ('facebook' | 'instagram' | 'linkedin')[],
    content: string,
    scheduledFor: Date,
    mediaUrls?: string[]
  ): Promise<ScheduledPost[]> {
    const scheduledPosts: ScheduledPost[] = []

    if (platforms.includes('facebook') && this.meta) {
      try {
        const post = await this.meta.schedulePagePost(content, scheduledFor, mediaUrls)
        scheduledPosts.push(post)
      } catch (error) {
        console.error('Failed to schedule Facebook post:', error)
      }
    }

    // LinkedIn and Instagram would require similar scheduling logic
    // For now, they would be stored locally and published at the scheduled time

    return scheduledPosts
  }

  async getAllMetrics(period: 'day' | 'week' | 'month' = 'day'): Promise<SocialMediaMetrics[]> {
    const metrics: SocialMediaMetrics[] = []

    if (this.meta) {
      try {
        const fbMetrics = await this.meta.getPageInsights(period)
        metrics.push(fbMetrics)
      } catch (error) {
        console.error('Failed to get Facebook metrics:', error)
      }
    }

    // Add other platform metrics here

    return metrics
  }

  getAvailablePlatforms(): string[] {
    const platforms: string[] = []
    if (this.meta) {
      platforms.push('facebook', 'instagram')
    }
    if (this.linkedin) {
      platforms.push('linkedin')
    }
    return platforms
  }

  async getRecentPosts(limit: number = 10): Promise<SocialMediaPost[]> {
    const allPosts: SocialMediaPost[] = []

    const promises: Promise<any>[] = []

    if (this.meta) {
      promises.push(
        this.meta.getPagePosts(limit).then(posts => allPosts.push(...posts)).catch(console.error)
      )
      promises.push(
        this.meta.getInstagramMedia(limit).then(posts => allPosts.push(...posts)).catch(console.error)
      )
    }

    await Promise.allSettled(promises)

    // Sort by publication date
    return allPosts
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
      .slice(0, limit)
  }
}
