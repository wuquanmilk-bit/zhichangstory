// src/composables/useDraft.ts
import { ref } from 'vue'
import { useSupabase } from './useSupabase'

export const useDraft = () => {
  const { supabase } = useSupabase()
  const saving = ref(false)
  const loading = ref(false)

  // 保存草稿
  const saveDraft = async (data: {
    title: string
    content: string
    authorId: string
    novelId?: string
  }) => {
    saving.value = true
    try {
      const { data: result, error } = await supabase.rpc('save_novel_draft', {
        p_title: data.title,
        p_content: data.content,
        p_author_id: data.authorId,
        p_novel_id: data.novelId || null
      })
      
      if (error) throw error
      return result
    } finally {
      saving.value = false
    }
  }

  // 获取用户草稿列表
  const getDrafts = async (authorId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase.rpc('get_user_drafts', {
        p_author_id: authorId
      })
      
      if (error) throw error
      return data
    } finally {
      loading.value = false
    }
  }

  // 发布草稿
  const publishDraft = async (draftId: string) => {
    const { data, error } = await supabase.rpc('publish_draft', {
      p_draft_id: draftId
    })
    
    if (error) throw error
    return data
  }

  // 删除草稿
  const deleteDraft = async (draftId: string) => {
    const { error } = await supabase
      .from('novel_drafts')
      .delete()
      .eq('id', draftId)
    
    if (error) throw error
  }

  return {
    saving,
    loading,
    saveDraft,
    getDrafts,
    publishDraft,
    deleteDraft
  }
}