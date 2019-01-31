from django.apps import AppConfig

from suit.apps import DjangoSuitConfig


class CoreConfig(AppConfig):
    name = "core"


class SuitConfig(DjangoSuitConfig):
    layout = "horizontal"
