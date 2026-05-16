import { useEffect, useState } from 'react'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Send } from 'lucide-react'

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

  const [newPost, setNewPost] = useState({
    title: '',
    tags: '',
    content: '',
  })

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/posts')
      const data: Post[] = await res.json()

      setPosts(data)
    } catch (error) {
      console.error('게시글 불러오기 실패:', error)
    }
  }

  const handleSubmit = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    try {
      const res = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPost.title,
          tags: newPost.tags,
          content: newPost.content,
        }),
      })

      const createdPost: Post = await res.json()

      setPosts([createdPost, ...posts])

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
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-2">
          커뮤니티
        </h1>

        <p className="text-sm text-muted-foreground">
          같은 꿈을 향해 함께 성장해요
        </p>
      </header>

      {/* New Post Form */}
      <Card className="mb-6">
        <CardContent className="space-y-3 p-4">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full text-left text-muted-foreground py-2"
            >
              새 글을 작성해보세요...
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

      {/* Posts */}
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