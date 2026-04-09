-- ═══════════════════════════════════════════════════════════
-- Políticas Adicionais para Mensagens de Contato
-- ═══════════════════════════════════════════════════════════

-- Garantir que admins possam atualizar (marcar como lido/respondido) e excluir mensagens
DO $$
BEGIN
  -- Política de UPDATE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='contact_messages' AND policyname='Admins can update contact messages'
  ) THEN
    CREATE POLICY "Admins can update contact messages" 
    ON public.contact_messages 
    FOR UPDATE 
    TO authenticated 
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;

  -- Política de DELETE
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='contact_messages' AND policyname='Admins can delete contact messages'
  ) THEN
    CREATE POLICY "Admins can delete contact messages" 
    ON public.contact_messages 
    FOR DELETE 
    TO authenticated 
    USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;
