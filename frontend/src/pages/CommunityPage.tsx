import { useEffect, useState } from 'react'
import { Input, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { useExpToast } from '@/components/common/useExpToast'

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

  const { showExpToast, ExpToast } = useExpToast()

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

      showExpToast(5)

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
    <div className="px-4 pt-5">
      <header className="mb-4 pl-2">
        <h1 className="mb-1 text-xl font-bold text-foreground">
          커뮤니티
        </h1>

        <p className="text-[13px] text-muted-foreground">
          같은 꿈을 향해 함께 성장해요
        </p>
      </header>

      <Card className="mb-3 rounded-[30px] py-0">
        <CardContent className="space-y-2 p-2">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full rounded-[24px] bg-white px-4 py-3 text-left text-[13px] text-slate-500"
            >
              {user
                ? '새 글을 작성해보세요...'
                : '로그인 후 글을 작성할 수 있어요'}
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
                className="h-10 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-[13px] placeholder:text-slate-500"
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
                className="h-10 w-full rounded-[18px] border border-slate-200 bg-white px-4 text-[13px] placeholder:text-slate-500"
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
                className="min-h-[72px] w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-[13px] placeholder:text-slate-500"
              />

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 flex-1 rounded-[18px]"
                  onClick={() => setIsExpanded(false)}
                >
                  취소
                </Button>

                <Button
                  size="sm"
                  className="h-9 flex-1 rounded-[18px]"
                  onClick={handleSubmit}
                  disabled={
                    !newPost.title.trim() ||
                    !newPost.content.trim()
                  }
                >
                  <Send className="mr-1 h-3.5 w-3.5" />
                  등록
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2.5 pb-24">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-[18px] py-0">
            <CardContent className="p-3">
              <h3 className="mb-1.5 line-clamp-1 text-[14px] font-semibold leading-tight text-foreground">
                {post.title}
              </h3>

              <div className="mb-2 flex flex-wrap gap-1">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="h-5 px-1.5 text-[10px] font-medium"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              <p className="mb-2 line-clamp-2 text-[12px] leading-[1.45] text-muted-foreground">
                {post.content}
              </p>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex min-w-0 items-center gap-1">
                  <span className="truncate">{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <button className="flex items-center gap-1 transition-colors hover:text-primary">
                    <Heart className="h-3.5 w-3.5" />
                    <span>{post.likes}</span>
                  </button>

                  <button className="flex items-center gap-1 transition-colors hover:text-primary">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{post.comments}</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {ExpToast}
    </div>
  )
}