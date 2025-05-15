from rest_framework import serializers
from .models import Workspace, Channel, DirectMessageGroup, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ["id", "name", "description", "created_at"]

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ["id", "workspace", "name", "description", "created_at"]

class DirectMessageGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectMessageGroup
        fields = ["id", "name", "participants", "created_at"]

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    
    class Meta:
        model = Message
        fields = ["id", "channel", "dm_group", "sender", "content", "timestamp", "is_read"]