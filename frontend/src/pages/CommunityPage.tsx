import { useEffect, useState } from 'react'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { addActivity } from '@/lib/addActivity'

type User = {
  id: number
  email: string
  nickname: string
}

type Post = {
  id: number
  title: string
  content: string
  tags: string[]
  author: string
  date: string
  likes: number
  comments: number
}

export function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<User | null>(null)

  const [newPost, setNewPost] = useState({
    title: '',
    tags: '',
    content: '',
  })

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    fetchPosts()
  }, [])

  const formatPost = (post: any): Post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    tags: post.category
      ? post.category.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : [],
    author: post.author || post.nickname || '익명',
    date: post.created_at ? post.created_at.slice(0, 10) : '',
    likes: 0,
    comments: 0,
  })

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/db/posts')
      const data = await res.json()

      setPosts(data.map(formatPost))
    } catch (error) {
      console.error('게시글 불러오기 실패:', error)
    }
  }

  const handleSubmit = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    if (!user) {
      alert('로그인 후 글을 작성할 수 있습니다.')
      return
    }

    try {
      const res = await fetch('http://localhost:4000/api/db/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          title: newPost.title,
          content: newPost.content,
          category: newPost.tags,
        }),
      })

      if (!res.ok) {
        throw new Error('게시글 등록 실패')
      }

      
      await res.json()
      await fetchPosts()
      await addActivity(
        user.id,
        'post_create',
        '커뮤니티 게시글 작성',
        10
      )

      setNewPost({
        title: '',
        tags: '',
        content: '',
      })

      setIsExpanded(false)
    } catch (error) {
      console.error('게시글 등록 실패:', error)
    }
  }

  return (
    <div className="min-h-screen px-4 pt-12 pb-24 safe-area-top">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-2">
          커뮤니티
        </h1>

        <p className="text-sm text-muted-foreground">
          같은 꿈을 향해 함께 성장해요
        </p>
      </header>

      <Card className="mb-6">
        <CardContent className="space-y-3 p-4">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full text-left text-muted-foreground py-2"
            >
              {user ? '새 글을 작성해보세요...' : '로그인 후 글을 작성할 수 있어요'}
            </button>
          ) : (
            <>
              <Input
                placeholder="제목"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    title: e.target.value,
                  })
                }
              />

              <Input
                placeholder="태그 (쉼표로 구분)"
                value={newPost.tags}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    tags: e.target.value,
                  })
                }
              />

              <Textarea
                placeholder="내용을 입력하세요"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({
                    ...newPost,
                    content: e.target.value,
                  })
                }
              />

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setIsExpanded(false)}
                >
                  취소
                </Button>

                <Button
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={
                    !newPost.title.trim() ||
                    !newPost.content.trim()
                  }
                >
                  <Send className="h-4 w-4 mr-1" />
                  등록
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">
                {post.title}
              </h3>

              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {post.content}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}